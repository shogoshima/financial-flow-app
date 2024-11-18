import { Transaction, TransactionBase, TransactionType } from "@/models/transaction";
import prisma from "@/bin/prisma";

export class TransactionService {
  static async createTransaction(userId: string, transactionData: TransactionBase): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
        userId
      }
    });

    return this.mapToModel(transaction);
  }

  static async getTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId
      }
    });

    return transactions.map(transaction => this.mapToModel(transaction));
  }

  static async updateTransaction(id: string, updatedFields: Partial<TransactionBase>): Promise<Transaction> {
    const transaction = await prisma.transaction.update({
      where: {
        id
      },
      data: {
        ...updatedFields
      }
    });

    return this.mapToModel(transaction);
  }

  static async deleteTransaction(id: string): Promise<void> {
    await prisma.transaction.delete({
      where: {
        id
      }
    });
  }

  static mapToModel({
    id, type, amount, date, description, category, userId
  }: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    category: string;
    userId: string
  }): Transaction {
    return new Transaction({
      id,
      type: TransactionType[type as keyof typeof TransactionType],
      amount,
      date,
      description,
      category,
      userId
    });
  };
}