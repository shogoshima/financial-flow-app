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

  updateCurrentAmount(amount: number): void {
    this.currentAmount = amount;
  }
}
