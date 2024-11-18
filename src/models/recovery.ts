export interface RecoveryModel {
  userId: string
  recoveryToken: string
  expiresAt: Date
}

export class Recovery {
  private userId: string;
  private recoveryToken: string;
  private expiresAt: Date;

  constructor(
    userId: string,
    recoveryToken: string,
    expiresAt: Date
  ) {
    this.userId = userId;
    this.recoveryToken = recoveryToken;
    this.expiresAt = expiresAt;
  }
}