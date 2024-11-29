import { RecoveryService } from "@/services/recovery.service"

export interface RecoveryModel {
  userId: string
  recoveryToken: string
  expiresAt: Date
}

export class Recovery {
  private userId: string;
  public recoveryToken: string;
  public expiresAt: Date;

  constructor({
    userId, recoveryToken, expiresAt
  }: RecoveryModel
  ) {
    this.userId = userId;
    this.recoveryToken = recoveryToken;
    this.expiresAt = expiresAt;
  }

  // setters
  async setToken(recoveryToken: string): Promise<void> {
    this.recoveryToken = recoveryToken;
    await RecoveryService.setRecoveryToken(this.userId);
  }

  async sendToken(email: string): Promise<void> {

  }

  // static
  static async createToken(userId: string,): Promise<Recovery> {
    const recovery = await RecoveryService.createRecoveryToken(userId);
    return recovery;
  }

  static async validateToken(userId: string, token: string): Promise<boolean> {
    const verified = await RecoveryService.verifyRecoveryToken(userId, token);
    return verified;
  }
}