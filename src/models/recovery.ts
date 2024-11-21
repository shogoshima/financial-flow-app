import { RecoveryService } from "@/services/recovery.service"

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

  static async createRecovery(userId: string,): Promise<Recovery> {
    const recovery = await RecoveryService.createRecovery(userId);
    return recovery;
  }

  static async verifyToken(userId: string, token: string): Promise<boolean> {
    const verified = await RecoveryService.verifyRecoveryToken(userId, token);
    return verified;
  }
}