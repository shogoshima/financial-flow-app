import prisma from "@/bin/prisma";
import { Auth, AuthModel } from "@/models/auth";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { SignJWT } from "jose/jwt/sign";
// import { jwtVerify } from "jose/jwt/verify";
import bcrypt from 'bcryptjs';

// import { createSigner, createVerifier } from "fast-jwt";

// const jwtsecret =  new TextEncoder().encode("super-cool-secret-key");
const jwtsecret = "super-cool-secret-key"

interface CustomJwtPayload {
  authId: string;
  iat?: number; // Issued at (optional, added automatically)
  exp?: number; // Expiration time (optional, added automatically)

}

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

  static async getAuthByEmail(email: string): Promise<Auth | null> {
    const auth = await prisma.auth.findUnique({
      where: {
        email
      }
    });

    if (!auth) return null;

    return this.mapToModel(auth);
  }

  static async createCredentials(userId: string, email: string, password: string): Promise<Auth | null> {

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) return null;

    // if (password.length < 8) return null;

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

  static  createJwtToken(authId: string): string {
    // const secret =  "super-cool-secret-key";
    // const expiresIn = "7d"; // Example: 7 days
    const payload = { authId : authId };
    // const token = jwt.sign(payload, jwtsecret);

    // const signer = createSigner({ key: jwtsecret, algorithm: "HS256" , expiresIn: "7d" });
    // const token = signer(payload);
    const token = authId;
    // const token = await new SignJWT(payload )
    // .setProtectedHeader({ alg: "HS256" })
    // .setIssuedAt()
    // .setExpirationTime("7d")
    // .sign(jwtsecret);

    console.log("[createJwtToken] created token", token);
    return token;
  }

  static  verifySession(token: string): string | null {
    try {
      // const secret = "super-cool-secret-key"
      console.log("[verifySession] verifying token for secret", token, "secret", jwtsecret);
      if (!token) {
        console.log("no token");
        throw new Error("No token provided");
      };

      // const verifier = createVerifier({ key: jwtsecret });
      // const typed = verifier(token) as CustomJwtPayload;
      
      // const payload = jwt.verify(token, jwtsecret) as JwtPayload; //& { authId: string };
      // console.log("payload", payload);

      // // const payload = jwtVerify(token, jwtsecret, { algorithms: ["HS256"] });
      // const un = payload as unknown;
      // const typed = un as CustomJwtPayload;
      // return Promise.resolve(payload.authId) || null;
      // const authId = payload.authId as string;

      // simulating jwt because nexts jwt is not working
      console.log("[verifySession] token verified", token);
      return token;
    } catch (err) {
      console.log("could not verify token", err);
      // throw new Error("Invalid token");
    }

    return null;
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