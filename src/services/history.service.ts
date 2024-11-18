import { Transaction, TransactionType } from "@/models";
import prisma from "@/bin/prisma";
import { TransactionService } from "./transaction.service";

export class HistoryService {
  static async fetchHistory(type: TransactionType, startDate: Date, endDate: Date): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany(
      {
        where: {
          type,
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    );

    return transactions.map((transaction) => TransactionService.mapToModel(transaction));
  }
}