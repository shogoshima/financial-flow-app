import prisma from "@/bin/prisma";
import { Auth, AuthModel, AuthBase } from "@/models/auth";
import { Jwt } from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export class AuthService {
  static async createAuth(authData: AuthBase): Promise<Auth | null> {
    if (!authData.password) return null;

    const hash = await bcrypt.hash(authData.password, 10);

    const auth = await prisma.auth.create({
      data: {
        ...authData,
        passwordHash: hash
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

  static mapToModel({
    id, email, passwordHash, sessionToken, expiresAt, lastLogin, loginAttempts
  }: {
    id: string;
    email: string;
    passwordHash: string;
    sessionToken: string | null;
    expiresAt: Date | null;
    lastLogin: Date | null;
    loginAttempts: number;
  }): Auth {
    return new Auth({
      id,
      email,
      passwordHash,
      sessionToken: sessionToken ? sessionToken : null,
      expiresAt: expiresAt ? expiresAt : null,
      lastLogin: lastLogin ? lastLogin : null,
      loginAttempts
    });
  }
}