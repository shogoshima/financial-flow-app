import { HistoryService } from '@/services/history.service';
import { Transaction, TransactionType, TransactionModel } from './transaction';
import { TransactionService } from '@/services';

export interface HistoryModel {
  id: string
  startDate: Date
  endDate: Date
  totalIncome: number
  totalExpenses: number
  netSavings: number
}

export class History {
  public id: string;
  public startDate: Date;
  public endDate: Date;
  public totalIncome: number;
  public totalExpenses: number;
  public netSavings: number;

  constructor({
    id, startDate, endDate, totalIncome, totalExpenses, netSavings
  }: HistoryModel
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalIncome = totalIncome;
    this.totalExpenses = totalExpenses;
    this.netSavings = netSavings;
  }

  // Getters
  getTotalIncome(): number {
    return this.totalIncome;
  }

  getTotalExpenses(): number {
    return this.totalExpenses;
  }

  getNetSavings(): number {
    return this.netSavings;
  }

  // Methods
  async addTransaction(transaction: Transaction): Promise<void> {
    await TransactionService.createTransaction(this.id, transaction);
    await this.filterHistory({});
  }

  async filterHistory({ startDate, endDate }: { startDate?: Date, endDate?: Date }): Promise<Transaction[]> {
    const filteredTransactions = await TransactionService.getFilteredTransactions({ startDate, endDate });

    const transactions: Transaction[] = filteredTransactions.map((transaction: TransactionModel) => TransactionService.mapToModel(transaction));
    this.startDate = startDate ?? this.startDate;
    this.endDate = endDate ?? this.endDate;

    this.totalExpenses = 0;
    this.totalIncome = 0;
    this.netSavings = 0;
    filteredTransactions.map((transaction: Transaction) => {
      if (transaction.type == TransactionType.EXPENSE) this.totalExpenses += transaction.amount;
      else if (transaction.type === TransactionType.INCOME) this.totalIncome += transaction.amount;
      else this.netSavings += transaction.amount;
    })

    this.netSavings += this.totalIncome - this.totalExpenses;

    await HistoryService.updateHistory(this.id, {
      startDate: this.startDate,
      endDate: this.endDate,
      totalIncome: this.totalIncome,
      totalExpenses: this.totalExpenses,
      netSavings: this.netSavings,
    });

    return transactions;
  }

  generateSummary(): string {
    return `Summary: ${this.totalIncome} in income, ${this.totalExpenses} in expenses, ${this.netSavings} in net savings.`;
  }

  // Static Methods
  static async getLastSavedHistory(userId: string): Promise<History | null> {
    const history = await HistoryService.getHistoryByUserId(userId);
    if (!history) return null;
    return history;
  }
}