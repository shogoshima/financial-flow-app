import { BudgetService } from "@/services"

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  DAILY = 'DAILY',
  CUSTOM = 'CUSTOM'
}

export interface BudgetBase {
  totalIncome: number
  totalExpenses: number
  limit: number
  period: BudgetPeriod
}

export interface BudgetModel extends BudgetBase {
  userId: string
  id: string
}

export class Budget {
  public id: string;
  private totalIncome: number;
  private totalExpenses: number;
  public limit: number;
  private userId: string;
  private period: BudgetPeriod;

  constructor({
    id, totalIncome, totalExpenses, limit, userId, period
  }: BudgetModel
  ) {
    this.id = id;
    this.totalIncome = totalIncome;
    this.totalExpenses = totalExpenses;
    this.limit = limit;
    this.userId = userId;
    this.period = period;
  }

  // Getters
  getTotalIncome(): number {
    return this.totalIncome;
  }

  getTotalExpenses(): number {
    return this.totalExpenses;
  }

  getLimit(): number {
    return this.limit;
  }

  getUserId(): string {
    return this.userId;
  }

  getPeriod(): BudgetPeriod {
    return this.period;
  }

  // Setters
  setTotalIncome(income: number): void {
    this.totalIncome = income;
    BudgetService.updateBudget(this.id, { totalIncome: income });
  }

  setTotalExpenses(expenses: number): void {
    this.totalExpenses = expenses;
    BudgetService.updateBudget(this.id, { totalExpenses: expenses });
  }

  setLimit(limit: number): void {
    this.limit = limit;
    BudgetService.updateBudget(this.id, { limit });
  }

  setPeriod(period: BudgetPeriod): void {
    this.period = period;
    BudgetService.updateBudget(this.id, { period });
  }

  // Methods
  static async create(userId: string, budget: BudgetBase): Promise<Budget> {
    const newBudget = await BudgetService.createBudget(userId, budget);
    return newBudget;
  }

  static async getByUserId(userId: string): Promise<Budget | null> {
    const budget = await BudgetService.getBudget(userId);
    if (!budget) return null;
    return budget;
  }

  static async update(id: string, budget: Partial<BudgetBase>): Promise<Budget> {
    const updatedBudget = await BudgetService.updateBudget(id, budget);
    return updatedBudget;
  }
}