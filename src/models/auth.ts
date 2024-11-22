import { AuthService } from "@/services";

export interface AuthBase {
  email: string,
  passwordHash: string,
}

export interface AuthModel extends AuthBase {
  id: string,
  emailVerified: boolean,
  sessionToken: string | null,
  expiresAt: Date | null,
  lastLogin: Date | null,
  loginAttempts: number
}

export class Auth {
  public id: string;
  private email: string;
  private passwordHash: string;
  private emailVerified: boolean;
  private sessionToken: string | null;
  private expiresAt: Date | null;
  private lastLogin: Date | null;
  private loginAttempts: number;

  constructor(
    { id, email, passwordHash, emailVerified, sessionToken, expiresAt, lastLogin, loginAttempts }: AuthModel
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.emailVerified = emailVerified;
    this.sessionToken = sessionToken;
    this.expiresAt = expiresAt;
    this.lastLogin = lastLogin;
    this.loginAttempts = loginAttempts;
  }

  // Getters
  getEmail(): string {
    return this.email;
  }

  getSessionToken(): string {
    return this.sessionToken ? this.sessionToken : '';
  }

  getLoginAttempts(): number {
    return this.loginAttempts;
  }

  // Setters
  setSessionToken(token: string): void {
    this.sessionToken = token;
  }

  setExpiresAt(date: Date): void {
    this.expiresAt = date;
  }

  setLastLogin(date: Date): void {
    this.lastLogin = date;
  }

  resetLoginAttempts(): void {
    this.loginAttempts = 0;
  }

  incrementLoginAttempts(): void {
    this.loginAttempts += 1;
  }

  // Methods
  static isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPasswordValid(password: string): boolean {
    return password.length >= 8;
  }

  static async create(email: string, password: string): Promise<Auth> {
    if (!Auth.isEmailValid(email))
      throw new Error('Invalid email');

    if (!Auth.isPasswordValid(password))
      throw new Error('Invalid password');

    const passwordHash = await AuthService.hashPassword(password);
    const auth = await AuthService.createAuth({ email, passwordHash });

    if (!auth) throw new Error('Could not create auth');

    return auth;
  }

  static async update(id: string, updatedFields: Partial<AuthBase>): Promise<Auth> {
    const auth = await AuthService.updateAuth(id, updatedFields);
    return auth;
  }
}