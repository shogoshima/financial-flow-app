import { Auth, History, Budget, Goal, Preferences, Transaction, User } from "@/models";
import { BudgetService, GoalService, PreferencesService, TransactionService, AuthService } from ".";
import prisma from "@/bin/prisma";
import { HistoryService } from "./history.service";

export class UserService {
  static async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        avatar: true,
        preferences: true,
        goals: true,
        history: true,
        budget: true,
      }
    });

    if (!user)
      return null;

    return new User(
      id,
      user.name,
      user.cpf,
      user.avatar,
      user.preferences ? PreferencesService.mapToModel(user.preferences) : null,
      user.goals.map(goal => GoalService.mapToModel(goal)),
      user.budget ? BudgetService.mapToModel(user.budget) : null,
    );
  }

  static async createUser(name: string, cpf: string): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        cpf,
      },
    });

    return new User(
      user.id,
      user.name,
      user.cpf,
      null,
      null,
      [],
      null,
    );
  }

  static async updateUser(id: string, params: { name?: string; cpf?: string; avatar?: string }): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        ...params, // Only the provided fields will be updated
      },
    });
  }
}