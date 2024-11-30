// actions for authentication
"use server";

import { getCookie, removeCookie, setCookie } from "@/bin/cookie";
import { Auth } from "@/models";

export async function login(formData: FormData): Promise<string | null> {
  const auth = await Auth.get(formData.get("email") as string);
  if (!auth) return null;

  const isValid = await auth.validatePassword(formData.get("password") as string);
  if (!isValid) return null;

  const token = auth.generateJwtToken();
  await setCookie("token", token);

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