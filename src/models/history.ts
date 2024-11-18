import { HistoryService } from '@/services/history.service';
import { Transaction, TransactionType, TransactionModel } from './transaction';

export interface HistoryModel {
  type: TransactionType
  startDate: Date
  endDate: Date
  totalIncome: number
  totalExpenses: number
  netSavings: number
  transactions: TransactionModel[]
}

export class History {
  private type: TransactionType;
  public startDate: Date;
  public endDate: Date;
  private totalIncome: number = 0;
  private totalExpenses: number = 0;
  private netSavings: number = 0;
  private transactions: Transaction[] = [];

  constructor(
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ) {
    this.type = type;
    this.startDate = startDate;
    this.endDate = endDate;
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
  async fetchHistory(): Promise<Transaction[]> {
    const history = await HistoryService.fetchHistory(this.type, this.startDate, this.endDate);
    return this.transactions = history;
  }

  async calculateNumbers(): Promise<void> {
    await this.fetchHistory();
    this.transactions.forEach(transaction => {
      if (transaction.getType() === TransactionType.INCOME) {
        this.totalIncome += transaction.getAmount();
      } else {
        this.totalExpenses += transaction.getAmount();
      }
    });

    this.netSavings = this.totalIncome - this.totalExpenses;
  }
}