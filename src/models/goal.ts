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

export interface GoalBase {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  type: GoalType;
  status: GoalStatus;
}

export interface GoalModel extends GoalBase {
  userId: string;
  id: string;
}

export class Goal {
  public id: string;
  public name: string;
  private targetAmount: number;
  private currentAmount: number;
  private deadline: Date;
  private type: GoalType;
  private status: GoalStatus;
  private userId: string;

  constructor({
    id, name, targetAmount, currentAmount, deadline, type, status, userId
  }: GoalModel) {
    this.id = id;
    this.name = name;
    this.targetAmount = targetAmount;
    this.currentAmount = currentAmount;
    this.deadline = deadline;
    this.type = type;
    this.status = status;
    this.userId = userId;
  }

  // Getters
  getName(): string {
    return this.name;
  }

  getTargetAmount(): number {
    return this.targetAmount;
  }

  getCurrentAmount(): number {
    return this.currentAmount;
  }

  getDeadline(): Date {
    return this.deadline;
  }

  getType(): GoalType {
    return this.type;
  }

  getStatus(): GoalStatus {
    return this.status;
  }

  // Static methods
  static async create(userId: string, {
    name, targetAmount, currentAmount, deadline, type, status
  }: GoalBase): Promise<Goal> {
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

  static async update(id: string, updatedFields: Partial<GoalBase>): Promise<Goal> {
    const goal = await GoalService.updateGoal(id, updatedFields);
    return goal;
  }
}
