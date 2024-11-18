import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

class RecoveryService {
  async sendVerifyEmail(email: string, token: string): Promise<void> {
    resend.emails.send({
      from: 'financial@flow.dev',
      to: email,
      subject: 'Your email verification link',
      html: `<p>${token}</p>`
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    resend.emails.send({
      from: 'financial@flow.dev',
      to: email,
      subject: 'Your password reset link',
      html: `<p>${token}</p>`
    });
  }

  async sendPasswordChangedEmail(email: string): Promise<void> {
    resend.emails.send({
      from: 'financial@flow.dev',
      to: email,
      subject: 'Your password was changed',
      html: `<p>Your password was changed successfully!</p>`
    });
  }
}