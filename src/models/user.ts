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
import { UserService } from '@/services';

export class User {
  public readonly id: string;
  private name: string;
  private readonly cpf: string;
  public avatar: string | null;
  private preferences: Preferences | null;
  private goals: Goal[];
  private transactions: Transaction[];
  private budget?: Budget | null;
  private auth: Auth;
  private recovery?: Recovery

  constructor(
    id: string,
    name: string,
    cpf: string,
    preferences: Preferences | null,
    goals: Goal[],
    transactions: Transaction[],
    budget: Budget | null,
    avatar: string | null,
    auth: Auth,
  ) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.preferences = preferences;
    this.goals = goals;
    this.transactions = transactions;
    this.budget = budget;
    this.avatar = avatar ?? null;
    this.auth = auth;
  }

  // Profile-related methods
  getName(): string {
    return this.name;
  }

  getCpf(): string {
    return this.cpf;
  }

  getPreferences(): Preferences | null {
    return this.preferences ? this.preferences : null;
  }

  async getUser(id: string): Promise<User | null> {
    const user = await UserService.getUserById(id);
    if (!user) return null;
    return user;
  }

  async setName(name: string): Promise<void> {
    this.name = name;
    await UserService.updateUser(this.id, { name });
  }

  setPreferences(preferences: Preferences): void {
    this.preferences = preferences;
  }

  // Goal related methods
  addGoal(goal: Goal): void {
    this.goals.push(goal);
  }

  removeGoal(goalId: string): void {
    this.goals = this.goals.filter(goal => goal.id !== goalId);
  }

  getGoals(): Goal[] {
    return this.goals;
  }

  // Static methods
  /// Should not call this until the email is verified
  static async create(name: string, cpf: string, email: string, password: string): Promise<User> {
    const auth = await Auth.create(email, password);
    const user = await UserService.createUser(name, cpf, auth.id);
    return user;
  }

  static async getById(id: string): Promise<User | null> {
    const user = await UserService.getUserById(id);
    if (!user) return null;
    return user;
  }

  static async update(id: string, params: { name?: string; cpf?: string; avatar?: string }): Promise<void> {
    await UserService.updateUser(id, params);
  }
}