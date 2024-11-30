import { cookies } from "next/headers";

export async function setCookie(name: string, value: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
}

export async function getCookie(name: string): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(name);
  if (!token) return "";
  return token.value;
}

export async function removeCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}