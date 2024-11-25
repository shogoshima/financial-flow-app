import prisma from "@/bin/prisma";
import { Auth, AuthModel, AuthBase } from "@/models/auth";
import { Jwt } from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export class AuthService {
  static async createAuth(authData: AuthBase): Promise<Auth | null> {
    if (!authData.passwordHash) return null;

    const auth = await prisma.auth.create({
      data: {
        ...authData,
      }
    });

    return this.mapToModel(auth);
  }

  static async verifyAuth(email: string, password: string): Promise<Auth | null> {
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

  static async updateAuth(id: string, updatedFields: Partial<AuthBase>): Promise<Auth> {
    const auth = await prisma.auth.update({
      where: {
        id
      },
      data: {
        ...updatedFields
      }
    });

    return this.mapToModel(auth);
  }

  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static mapToModel({
    id, email, passwordHash, emailVerified, sessionToken, expiresAt, lastLogin, loginAttempts
  }: {
    id: string;
    email: string;
    passwordHash: string;
    emailVerified: boolean;
    sessionToken: string | null;
    expiresAt: Date | null;
    lastLogin: Date | null;
    loginAttempts: number;
  }): Auth {
    return new Auth({
      id,
      email,
      passwordHash,
      emailVerified: emailVerified,
      sessionToken: sessionToken ? sessionToken : null,
      expiresAt: expiresAt ? expiresAt : null,
      lastLogin: lastLogin ? lastLogin : null,
      loginAttempts
    });
  }
}