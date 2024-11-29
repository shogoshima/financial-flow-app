import { GoalService } from "@/services";

export enum GoalType {
  LONG_TERM = 'LONG_TERM',
  SHORT_TERM = 'SHORT_TERM',
  MEDIUM_TERM = 'MEDIUM_TERM',
}

export enum GoalStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface GoalModel {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  type: GoalType;
  status: GoalStatus;
  createdAt?: Date;
}

export class Goal {
  public id: string;
  public name: string;
  public targetAmount: number;
  public currentAmount: number;
  public deadline: Date;
  public type: GoalType;
  public status: GoalStatus;
  public createdAt?: Date;

  constructor({
    id, name, targetAmount, currentAmount, deadline, type, status, createdAt
  }: GoalModel) {
    this.id = id;
    this.name = name;
    this.targetAmount = targetAmount;
    this.currentAmount = currentAmount;
    this.deadline = deadline;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt ?? new Date();
  }

  // Static methods

  async updateProgress(updatedFields: Partial<GoalModel>): Promise<Goal> {
    const goal = await GoalService.updateGoal(this.id, updatedFields);
    return goal;
  }

  async cancelGoal(): Promise<void> {
    await this.updateProgress({ status: GoalStatus.FAILED });
  }

  async completeGoal(): Promise<void> {
    await this.updateProgress({ status: GoalStatus.COMPLETED });
  }

  // static
  static async create(userId: string, {
    name, targetAmount, currentAmount, deadline, type, status
  }: GoalModel): Promise<Goal> {
    const goal = await GoalService.createGoal(userId, { name, targetAmount, currentAmount, deadline, type, status });
    return goal;
  }

  static async getManyByUserId(userId: string): Promise<Goal[]> {
    const goals = await GoalService.getGoals(userId);
    return goals;
  }

  static async getById(id: string): Promise<Goal | null> {
    const goal = await GoalService.getGoalById(id);
    if (!goal) return null;
    return goal;
  }
}
