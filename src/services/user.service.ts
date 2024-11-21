import { Auth, Budget, Goal, Preferences, Transaction, User } from "@/models";
import { BudgetService, GoalService, PreferencesService, TransactionService, AuthService } from ".";
import prisma from "@/bin/prisma";

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
        transactions: true,
        budget: true,
        auth: true
      }
    });

    if (!user)
      return null;

    return new User(
      id,
      user.name,
      user.cpf,
      user.preferences ? PreferencesService.mapToModel(user.preferences) : null,
      user.goals.map(goal => GoalService.mapToModel(goal)),
      user.transactions.map(transaction => TransactionService.mapToModel(transaction)),
      user.budget ? BudgetService.mapToModel(user.budget) : null,
      user.avatar,
      new Auth(user.auth)
    );
  }

  static async createUser(name: string, cpf: string, authId: string): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        cpf,
        auth: {
          connect: {
            id: authId
          }
        }
      },
      include: {
        auth: true,
      }
    });

    return new User(
      user.id,
      user.name,
      user.cpf,
      null,
      [],
      [],
      null,
      null,
      AuthService.mapToModel(user.auth)
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