import prisma from "@/bin/prisma";
import { Goal, GoalBase, GoalModel, GoalStatus, GoalType } from "@/models/goal";

export class GoalService {
  static async createGoal(userId: string, goalData: GoalBase): Promise<Goal> {
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

  static async updateGoal(id: string, updatedFields: Partial<GoalBase>): Promise<Goal> {
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
      userId
    })
  }
}