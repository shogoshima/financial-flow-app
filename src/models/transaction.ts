export enum TransactionType {
  INVESTMENT = 'INVESTMENT',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface TransactionBase {
  type: TransactionType
  amount: number
  date: Date
  description: string
  category: string
}

export interface TransactionModel extends TransactionBase {
  userId: string
  id: string
}

export class Transaction {
  public id: string;
  private type: TransactionType;
  private amount: number;
  private date: Date;
  private description: string;
  private category: string;
  public userId: string;

  constructor({
    id, type, amount, date, description, category, userId
  }: TransactionModel
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.category = category;
    this.userId = userId;
  }

  // Getters
  getType(): TransactionType {
    return this.type;
  }

  getAmount(): number {
    return this.amount;
  }

  getDate(): Date {
    return this.date;
  }

  getDescription(): string {
    return this.description;
  }

  getCategory(): string {
    return this.category;
  }

  // Setters

}