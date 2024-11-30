import { BudgetService } from "@/services"

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  DAILY = 'DAILY',
  CUSTOM = 'CUSTOM'
}

export interface BudgetModel {
  limit: number,
  id: string
}

export class Budget {
  public id: string;
  public limit: number;

  constructor({
    id, limit
  }: BudgetModel
  ) {
    this.id = id;
    this.limit = limit
  }

  async setLimit(limit: number): Promise<Budget> {
    const updatedBudget = await BudgetService.updateBudget(this.id, { limit });
    return updatedBudget;
  }

  async calculateRemaining(userId: string): Promise<number> {
    const budget = await BudgetService.getBudget(userId);
    if (!budget) return 0;
    return budget.limit;
  }

  // Static Methods
  static async create(userId: string, budget: BudgetModel): Promise<Budget> {
    const newBudget = await BudgetService.createBudget(userId, budget);
    return newBudget;
  }

  static async getByUserId(userId: string): Promise<Budget | null> {
    const budget = await BudgetService.getBudget(userId);
    if (!budget) return null;
    return budget;
  }
}