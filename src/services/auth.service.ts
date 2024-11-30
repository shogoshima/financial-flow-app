import prisma from "@/bin/prisma";
import { Auth, AuthModel } from "@/models/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export class AuthService {
  static async getAuth(userId: string): Promise<Auth | null> {
    const auth = await prisma.auth.findUnique({
      where: {
        userId
      }
    });

    if (!auth) return null;

    return this.mapToModel(auth);
  }

  static async createCredentials(userId: string, email: string, password: string): Promise<Auth | null> {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return null;

    if (password.length < 8) return null;

    const passwordHash = await bcrypt.hash(password, 10);

    const auth = await prisma.auth.create({
      data: {
        email,
        passwordHash,
        user: {
          connect: {
            id: userId,
          }
        }
      }
    });

    if (!auth) return null;

    return this.mapToModel(auth);
  }

  static async verifyCredentials(password: string, passwordHash: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    return isPasswordValid;
  }

  static async updateAuth(authId: string, updatedFields: Partial<AuthModel>): Promise<Auth> {
    const auth = await prisma.auth.update({
      where: {
        id: authId
      },
      data: {
        ...updatedFields
      }
    });

    return this.mapToModel(auth);
  }

  static createJwtToken(authId: string): string {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = "7d"; // Example: 7 days
    const token = jwt.sign({ authId }, secret, { expiresIn });
    return token;
  }

  static verifySession(token: string): string | null {
    try {
      const secret = process.env.JWT_SECRET!;
      const payload = jwt.verify(token, secret) as JwtPayload;
      return payload.authId || null;
    } catch (err) {
      return null;
    }
  }

  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static mapToModel({
    id, email, passwordHash, emailVerified, jwtToken, lastLogin, loginAttempts, userId
  }: {
    id: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    jwtToken: string | null;
    lastLogin: Date | null;
    loginAttempts: number;
    userId: string;
  }): Auth {
    return new Auth({
      id,
      email,
      passwordHash,
      emailVerified: emailVerified,
      jwtToken: jwtToken ? jwtToken : null,
      lastLogin: lastLogin ? lastLogin : null,
      loginAttempts,
      userId
    });
  }
}