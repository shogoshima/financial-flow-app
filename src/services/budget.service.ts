import prisma from "@/bin/prisma";
import { Budget, BudgetBase, BudgetPeriod } from "@/models/budget";

export class BudgetService {
  static async createBudget(userId: string, budgetData: BudgetBase): Promise<Budget> {
    const budget = await prisma.budget.create({
      data: {
        ...budgetData,
        userId
      }
    });

    return this.mapToModel(budget);
  }

  static async getBudget(userId: string): Promise<Budget | null> {
    const budget = await prisma.budget.findFirst({
      where: {
        userId
      }
    });

    if (!budget)
      return null;

    return this.mapToModel(budget);
  }

  static async updateBudget(id: string, updatedFields: Partial<BudgetBase>): Promise<Budget> {
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
    id, totalIncome, totalExpenses, limit, period, userId
  }: {
    id: string;
    totalIncome: number;
    totalExpenses: number;
    limit: number;
    period: string;
    userId: string
  }): Budget {
    return new Budget({
      id,
      totalIncome,
      totalExpenses,
      limit,
      period: BudgetPeriod[period as keyof typeof BudgetPeriod],
      userId
    });
  };
}