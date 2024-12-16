// actions for authentication
"use server";

import { getCookie, removeCookie, setCookie } from "@/bin/cookie";
import { Auth } from "@/models";

export async function login(formData: FormData): Promise<string | null> {
  const auth = await Auth.getByEmail(formData.get("email") as string);
  if (!auth) return null;

  const isValid = await auth.validatePassword(formData.get("password") as string);
  if (!isValid) return null;

  console.log("[login] logged in. auth", auth);

  // const token = auth.generateJwtToken();
  const token = auth.userId;
  await setCookie("token", token);

  console.log("[login]  cookie set. token:", token);

  await auth.updateSession(token);

  return token;
}

export async function logout(): Promise<void> {
  const token = await getCookie("token");
  const auth = await Auth.get(token);
  if (!auth) return;

  await auth.invalidateSession();
  await removeCookie("token");
}

export async function checkAuth(): Promise<boolean> {
  const token = await getCookie("token");
  if (token) {
    const userId = await Auth.session(token);
    return !!userId;
  }
  return false;
}