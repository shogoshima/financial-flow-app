import prisma from "@/bin/prisma";
import { Auth, AuthModel } from "@/models/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export class AuthService {
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

  static async verifyCredentials(email: string, password: string): Promise<Auth | null> {
    const auth = await prisma.auth.findUnique({
      where: {
        email
      }
    });

    if (!auth) return null;

    if (!auth.emailVerified) return null;

    const isPasswordValid = await bcrypt.compare(password, auth.passwordHash);

    if (!isPasswordValid) return null;

    return this.mapToModel(auth);
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

  static verifySession(token: string): JwtPayload | null {
    try {
      const secret = process.env.JWT_SECRET!;
      return jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      return null;
    }
  }

  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static mapToModel({
    id, email, passwordHash, emailVerified, jwtToken, lastLogin, loginAttempts
  }: {
    id: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    jwtToken: string | null;
    lastLogin: Date | null;
    loginAttempts: number;
  }): Auth {
    return new Auth({
      id,
      email,
      passwordHash,
      emailVerified: emailVerified,
      jwtToken: jwtToken ? jwtToken : null,
      lastLogin: lastLogin ? lastLogin : null,
      loginAttempts
    });
  }
}