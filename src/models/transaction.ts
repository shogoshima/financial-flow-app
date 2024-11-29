import { TransactionService } from "@/services"

export enum TransactionType {
  INVESTMENT = 'INVESTMENT',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface TransactionModel {
  id: string
  type: TransactionType
  amount: number
  date: Date
  description: string
  category: string
}

export class Transaction {
  public id: string;
  public type: TransactionType;
  public amount: number;
  public date: Date;
  public description: string;
  public category: string;

  constructor({
    id, type, amount, date, description, category
  }: TransactionModel
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.category = category;
  }

  getDetails() {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      date: this.date,
      description: this.description,
      category: this.category
    }
  }

  async update(updatedFields: Partial<TransactionModel>): Promise<void> {
    this.type = updatedFields.type ?? this.type;
    this.amount = updatedFields.amount ?? this.amount;
    this.date = updatedFields.date ?? this.date;
    this.description = updatedFields.description ?? this.description;
    this.category = updatedFields.category ?? this.category;

    await TransactionService.updateTransaction(this.id, updatedFields);
  }
}