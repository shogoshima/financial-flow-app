export interface RecoveryBase {
  recoveryToken: string
  expiresAt: Date
}

export interface RecoveryModel extends RecoveryBase {
  id: string
  userId: string
}

export class Recovery {
  public id: string;
  private userId: string;
  private recoveryToken: string;
  private expiresAt: Date;

  constructor({
    id, userId, recoveryToken, expiresAt
  }: RecoveryModel
  ) {
    this.id = id;
    this.userId = userId;
    this.recoveryToken = recoveryToken;
    this.expiresAt = expiresAt;
  }
}