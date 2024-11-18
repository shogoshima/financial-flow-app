export interface AuthBase {
  email: string,
  password?: string
}

export interface AuthModel extends AuthBase {
  id: string,
  passwordHash: string,
  sessionToken: string | null,
  expiresAt: Date | null,
  lastLogin: Date | null,
  loginAttempts: number
}

export class Auth {
  private id: string;
  private email: string;
  private passwordHash: string;
  private sessionToken: string | null;
  private expiresAt: Date | null;
  private lastLogin: Date | null;
  private loginAttempts: number;

  constructor(
    { id, email, passwordHash, sessionToken, expiresAt, lastLogin, loginAttempts }: AuthModel
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
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
  setEmail(email: string): void {
    this.email = email;
  }

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
  
}