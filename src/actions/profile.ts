// actions for profile
"use server";

import { getCookie } from "@/bin/cookie";
import { Auth, Goal, GoalStatus, GoalType, User } from "@/models";

export async function register(formData: FormData): Promise<string> {
  const auth = await User.create(
    formData.get("name") as string,
    formData.get("cpf") as string,
    formData.get("email") as string,
    formData.get("password") as string
  );
  return auth.id;
}

// get user
export async function getUser(): Promise<User | null> {
  const token = await getCookie("token");
  if (!token) return null;
  const userId = await Auth.session(token);
  if (!userId) return null;
  return await User.getById(userId);
}

export async function updateProfile(formData: FormData): Promise<void> {
  const token = await getCookie("token");
  if (!token) return;
  const userId = await Auth.session(token);
  if (!userId) return;

  const user = await User.getById(userId);
  if (!user) return;

  await user.updateProfile({
    name: formData.get("name") as string ?? user.getName(),
    cpf: formData.get("cpf") as string ?? user.getCpf(),
    avatar: formData.get("avatar") as string ?? user.avatar,
  });
}

export async function addGoal(formData: FormData): Promise<void> {
  const token = await getCookie("token");
  if (!token) return;
  const userId = await Auth.session(token);
  if (!userId) return;

  await Goal.create(userId, {
    name: formData.get("name") as string,
    targetAmount: Number(formData.get("targetAmount")),
    currentAmount: 0,
    deadline: new Date(formData.get("deadline") as string),
    type: formData.get("type") as GoalType,
    status: GoalStatus.PENDING,
  });
}

export async function updateGoal(goalId: string, formData: FormData): Promise<void> {
  const goal = await Goal.getById(goalId);
  if (!goal) return;

  await goal.updateProgress({
    name: formData.get("name") as string ?? goal.name,
    targetAmount: Number(formData.get("targetAmount")) ?? goal.targetAmount,
    deadline: new Date(formData.get("deadline") as string) ?? goal.deadline,
    type: formData.get("type") as GoalType ?? goal.type,
  });
}

export async function completeGoal(goalId: string): Promise<void> {
  const goal = await Goal.getById(goalId);
  if (!goal) return;

  await goal.completeGoal();
}