import { Goal, GoalModel } from './goal';
import { Transaction, TransactionModel } from './transaction';
import { Preferences, PreferencesModel } from './preferences';
import { Auth, AuthModel } from './auth';
import { Budget, BudgetModel } from './budget';
import { Recovery, RecoveryModel } from './recovery';
import prisma from '@/bin/prisma';
import { GoalService } from '@/services/goal.service';
import { TransactionService } from '@/services/transaction.service';
import { BudgetService } from '@/services/budget.service';
import { PreferencesService } from '@/services/preferences.service';
import { AuthService, UserService } from '@/services';
import { HistoryService } from '@/services/history.service';

export class User {
  public readonly id: string;
  private name: string;
  private readonly cpf: string;
  public avatar: string | null;
  public preferences: Preferences | null;
  public goals: Goal[];
  public budget?: Budget | null;

  constructor(
    id: string,
    name: string,
    cpf: string,
    avatar: string | null,
    preferences: Preferences | null,
    goals: Goal[],
    budget: Budget | null,
  ) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.avatar = avatar ?? null;
    this.preferences = preferences;
    this.goals = goals;
    this.budget = budget;
  }

  // Profile-related methods
  getName(): string {
    return this.name;
  }

  getCpf(): string {
    return this.cpf;
  }

  async updateProfile(params: { name?: string; cpf?: string; avatar?: string }): Promise<void> {
    if (params.name) this.name = params.name;
    if (params.avatar) this.avatar = params.avatar;
    await UserService.updateUser(this.id, params);
  }

  // Static methods
  /// Should not call this until the email is verified
  static async create(name: string, cpf: string, email: string, password: string): Promise<User> {
    const user = await UserService.createUser(name, cpf);
    await AuthService.createCredentials(user.id, email, password);
    await HistoryService.createHistory(user.id);
    return user;
  }

  static async getById(id: string): Promise<User | null> {
    const user = await UserService.getUserById(id);
    if (!user) return null;
    return user;
  }
}