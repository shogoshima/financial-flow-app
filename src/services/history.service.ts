import { Transaction, TransactionType, History } from "@/models";
import prisma from "@/bin/prisma";
import { TransactionService } from "./transaction.service";

export class HistoryService {
  static async createHistory(userId: string): Promise<History> {
    const history = await prisma.history.create({
      data: {
        startDate: new Date(),
        endDate: new Date(),
        user: {
          connect: {
            id: userId
          },
        }
      },
    });

    return this.mapToModel({
      ...history,
    });
  }

  static async getHistoryByUserId(userId: string): Promise<History | null> {
    const history = await prisma.history.findUnique({
      where: {
        userId
      },
      include: {
        transactions: true,
      }
    })

    if (!history) return null;
    return this.mapToModel({
      ...history,
    });
  }

  static async updateHistory(id: string, updatedFields: Partial<History>): Promise<History> {
    const history = await prisma.history.update({
      where: {
        id
      },
      data: {
        ...updatedFields,
      }
    });

    return this.mapToModel(history);
  }

  static mapToModel({
    id, startDate, endDate, totalIncome, totalExpenses, netSavings
  }: {
    id: string,
    startDate: Date,
    endDate: Date,
    totalIncome: number,
    totalExpenses: number,
    netSavings: number,
  }): History {
    return new History({
      id,
      startDate,
      endDate,
      totalIncome,
      totalExpenses,
      netSavings,
    })
  }
}