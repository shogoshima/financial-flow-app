import { AuthService } from "@/services";

export interface AuthModel {
  id: string,
  email: string,
  passwordHash: string,
  emailVerified: boolean,
  jwtToken: string | null,
  lastLogin: Date | null,
  loginAttempts: number
  userId: string
}

export class Auth {
  public id: string;
  private email: string;
  private passwordHash: string;
  public emailVerified: boolean;
  private jwtToken: string | null;
  public lastLogin: Date | null;
  public loginAttempts: number;
  public userId: string;

  constructor(
    { id, email, passwordHash, emailVerified, jwtToken, lastLogin, loginAttempts, userId }: AuthModel
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.emailVerified = emailVerified;
    this.jwtToken = jwtToken;
    this.lastLogin = lastLogin;
    this.loginAttempts = loginAttempts;
    this.userId = userId;
  }

  // Methods
  async validatePassword(password: string): Promise<boolean> {
    const auth = await AuthService.verifyCredentials(password, this.passwordHash);
    if (!auth) {
      this.loginAttempts += 1;
      await AuthService.updateAuth(this.id, { loginAttempts: this.loginAttempts });
      return false;
    };
    return true;
  }

  generateJwtToken(): string {
    return AuthService.createJwtToken(this.id);
  }

  async updateSession(token: string): Promise<void> {
    await AuthService.updateAuth(this.id, { jwtToken: token, lastLogin: new Date() });
  }

  async invalidateSession(): Promise<void> {
    await AuthService.updateAuth(this.id, { jwtToken: null });
  }

  // Static Methods
  static async update(id: string, updatedFields: Partial<AuthModel>): Promise<Auth> {
    const auth = await AuthService.updateAuth(id, updatedFields);
    return auth;
  }
  
  

  static async get(authId: string): Promise<Auth | null> {
    const auth = await AuthService.getAuth(authId);

    if (!auth) return null;
    return auth;
  }

  static async getByEmail(email: string): Promise<Auth | null> {
    const auth = await AuthService.getAuthByEmail(email);

    if (!auth) return null;
    return auth;
  }

  static async session(token: string): Promise<string | null> {
    const authId = AuthService.verifySession(token);
    if (!authId) return null;
    return authId;
  }
}