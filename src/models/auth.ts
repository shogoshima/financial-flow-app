import { AuthService } from "@/services";

export interface AuthModel {
  id: string,
  email: string,
  passwordHash: string,
  emailVerified: boolean,
  jwtToken: string | null,
  lastLogin: Date | null,
  loginAttempts: number
}

export class Auth {
  public id: string;
  public email: string;
  public passwordHash: string;
  public jwtToken: string | null;
  public lastLogin: Date | null;
  public loginAttempts: number;

  constructor(
    { id, email, passwordHash, emailVerified, jwtToken, lastLogin, loginAttempts }: AuthModel
  ) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.jwtToken = jwtToken;
    this.lastLogin = lastLogin;
    this.loginAttempts = loginAttempts;
  }

  // Methods
  async validatePassword(password: string): Promise<boolean> {
    const auth = AuthService.verifyCredentials(this.email, password);
    if (!auth) return false;
    return true;
  }

  generateJwtToken(): string {
    return AuthService.createJwtToken(this.id);
  }

  async updateSession(token: string): Promise<void> {
    await AuthService.updateAuth(this.id, { jwtToken: token });
  }

  async invalidateSession(): Promise<void> {
    await AuthService.updateAuth(this.id, { jwtToken: null });
  }

  // Static Methods
  static async update(id: string, updatedFields: Partial<AuthModel>): Promise<Auth> {
    const auth = await AuthService.updateAuth(id, updatedFields);
    return auth;
  }
}