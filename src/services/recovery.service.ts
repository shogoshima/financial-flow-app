import prisma from "@/bin/prisma";
import { Resend } from "resend";
import { Recovery } from "@/models/recovery";
const resend = new Resend(process.env.RESEND_API_KEY);

export class RecoveryService {
  static async createRecovery(userId: string): Promise<Recovery> {
    const recoveryToken = Math.random().toString(36).substring(2, 7);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    const newRecovery = await prisma.recovery.create({
      data: { userId, recoveryToken, expiresAt }
    });

    return new Recovery(newRecovery);
  }

  static async updateRecoveryToken(userId: string): Promise<Recovery> {
    const recoveryToken = Math.random().toString(36).substring(2, 7);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    const updatedRecovery = await prisma.recovery.update({
      where: { userId },
      data: { recoveryToken, expiresAt }
    })

    return new Recovery(updatedRecovery);
  }

  static async verifyRecoveryToken(userId: string, recoveryToken: string): Promise<boolean> {
    const recovery = await prisma.recovery.findFirst({
      where: { userId, recoveryToken },
      select: { expiresAt: true }
    });

    if (!recovery) return false;
    if (recovery.expiresAt < new Date()) return false;

    return true;
  }

  static async sendVerifyEmail(email: string, token: string): Promise<void> {
    resend.emails.send({
      from: 'financial@flow.dev',
      to: email,
      subject: 'Your email verification link',
      html: `<p>${token}</p>`
    });
  }

  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    resend.emails.send({
      from: 'financial@flow.dev',
      to: email,
      subject: 'Your password reset link',
      html: `<p>${token}</p>`
    });
  }

  static async sendPasswordChangedEmail(email: string): Promise<void> {
    resend.emails.send({
      from: 'financial@flow.dev',
      to: email,
      subject: 'Your password was changed',
      html: `<p>Your password was changed successfully!</p>`
    });
  }
}