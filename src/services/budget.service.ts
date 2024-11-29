import prisma from "@/bin/prisma";
import { Budget, BudgetModel, BudgetPeriod } from "@/models/budget";

export class BudgetService {
  static async createBudget(userId: string, budgetData: Omit<BudgetModel, 'id'>): Promise<Budget> {
    const budget = await prisma.budget.create({
      data: {
        ...budgetData,
        userId
      }
    });

    return this.mapToModel(budget);
  }

  static async getBudget(userId: string): Promise<Budget | null> {
    const budget = await prisma.budget.findUnique({
      where: {
        userId
      }
    });

    if (!budget)
      return null;

    return this.mapToModel(budget);
  }

  static async updateBudget(id: string, updatedFields: Partial<BudgetModel>): Promise<Budget> {
    const budget = await prisma.budget.update({
      where: {
        id
      },
      data: {
        ...updatedFields
      }
    });

    return this.mapToModel(budget);
  }

  static mapToModel({
    id, limit,
  }: {
    id: string;
    limit: number;
  }): Budget {
    return new Budget({
      id,
      limit,
    });
  };
}