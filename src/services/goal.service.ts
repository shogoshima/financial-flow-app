import prisma from "@/bin/prisma";
import { Goal, GoalModel, GoalStatus, GoalType } from "@/models/goal";

export class GoalService {
  static async createGoal(userId: string, goalData: Omit<GoalModel, 'id'>): Promise<Goal> {
    const goal = await prisma.goal.create({
      data: {
        ...goalData,
        userId
      }
    });

    return this.mapToModel(goal);
  }

  static async getGoals(userId: string): Promise<Goal[]> {
    const goals = await prisma.goal.findMany({
      where: {
        userId
      }
    });

    return goals.map(goal => this.mapToModel(goal));
  }

  static async getGoalById(id: string): Promise<Goal | null> {
    const goal = await prisma.goal.findFirst({
      where: {
        id
      }
    });

    if (!goal)
      return null;

    return this.mapToModel(goal);
  }

  static async updateGoal(id: string, updatedFields: Partial<GoalModel>): Promise<Goal> {
    const goal = await prisma.goal.update({
      where: {
        id
      },
      data: {
        ...updatedFields
      }
    });

    return this.mapToModel(goal);
  }

  static async deleteGoal(id: string): Promise<void> {
    await prisma.goal.delete({
      where: {
        id
      }
    });
  }

  static mapToModel({
    id, name, targetAmount, currentAmount, deadline, type, status, userId
  }: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    type: string;
    status: string;
    userId: string
  }): Goal {
    // Ensure that type and status are converted to enum values
    return new Goal({
      id,
      name,
      targetAmount,
      currentAmount,
      deadline,
      type: GoalType[type as keyof typeof GoalType],
      status: GoalStatus[status as keyof typeof GoalStatus],
    })
  }
}