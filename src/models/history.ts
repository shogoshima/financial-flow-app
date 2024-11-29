import { HistoryService } from '@/services/history.service';
import { Transaction, TransactionType, TransactionModel } from './transaction';
import { TransactionService } from '@/services';

export interface HistoryModel {
  id: string
  transactions: Transaction[]
  startDate: Date
  endDate: Date
  totalIncome: number
  totalExpenses: number
  netSavings: number
}

export class History {
  public id: string;
  public transactions: Transaction[];
  public startDate: Date;
  public endDate: Date;
  public totalIncome: number;
  public totalExpenses: number;
  public netSavings: number;

  constructor({
    id, transactions, startDate, endDate, totalIncome, totalExpenses, netSavings
  }: HistoryModel
  ) {
    this.id = id;
    this.transactions = transactions;
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
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  async filterHistory({ startDate, endDate }: { startDate?: Date, endDate?: Date }): Promise<void> {
    const filteredTransactions = await TransactionService.getFilteredTransactions({ startDate, endDate });

    this.transactions = filteredTransactions;
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
  }

  generateSummary(): string {
    return `Summary: ${this.totalIncome} in income, ${this.totalExpenses} in expenses, ${this.netSavings} in net savings.`;
  }
}