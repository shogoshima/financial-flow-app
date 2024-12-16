import { Transaction, TransactionModel, TransactionType } from "@/models/transaction";
import prisma from "@/bin/prisma";

export class TransactionService {
  static async createTransaction(historyId: string, transactionData: Omit<TransactionModel, 'id'>): Promise<Transaction> {
    console.log('[TransactionService] creating transaction', transactionData, "history id", historyId);
    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
        historyId
      }
    });

    return this.mapToModel(transaction);
  }

  static async getTransactions(historyId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        historyId
      }
    });

    return transactions.map(transaction => this.mapToModel(transaction));
  }

  static async getFilteredTransactions({ startDate, endDate }: { startDate?: Date, endDate?: Date }) {
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        }
      }
    })

    return transactions.map(transaction => this.mapToModel(transaction));
  }

  static async updateTransaction(id: string, updatedFields: Partial<TransactionModel>): Promise<Transaction> {
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
    id, type, amount, date, description, category
  }: {
    id: string;
    type: string;
    amount: number;
    date: Date;
    description: string;
    category: string;
  }): Transaction {
    return new Transaction({
      id,
      type: TransactionType[type as keyof typeof TransactionType],
      amount,
      date,
      description,
      category,
    });
  };
}