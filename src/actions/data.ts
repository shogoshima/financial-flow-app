// actions for transactions and history data
"use server";

import { getCookie } from "@/bin/cookie";
import { Auth, Transaction, History, TransactionType } from "@/models";

// Add a new transaction
export async function addTransaction(formData: FormData): Promise<void> {

  console.log("[data.ts] adding transaction", formData);

  const token = formData.get("token") as string;

  console.log("[data.ts] found user token")

  // const userId = await Auth.session(token);
  // if (!userId) return;

  const history = await History.getByUserId(token);
  if (!history) return;

  console.log("[data.ts] found history")
  let transactionType = ""
  switch (formData.get("type")) {
    case "income":
      transactionType = TransactionType.INCOME
      break;
    case "expense":
      transactionType = TransactionType.EXPENSE
      break;
    default:
      transactionType = TransactionType.EXPENSE
  }

  await Transaction.create(history.id, {
    type: transactionType as TransactionType,
    amount: Number(formData.get("amount")),
    date: new Date(formData.get("date") as string),
    description: formData.get("description") as string,
    category: formData.get("category") as string,
  });

  console.log("[data.ts] created transaction")

  // Update history totals
  await history.updateTotals();

  console.log("[data.ts] updated totals")
}

// Get all transactions for the user
export async function getTransactions(token : string): Promise<Transaction[]> {

  console.log("[data.ts] getting transactions for user w token=", token);

  const history = await History.getByUserId(token);
  if (!history) return [];

  console.log("[data.ts] found history", history);

  return await history.getTransactions();
}

// Get history data for the user
export async function getHistory(): Promise<History | null> {
  const token = await getCookie("token");
  if (!token) return null;
  const userId = await Auth.session(token);
  if (!userId) return null;

  return await History.getByUserId(userId);
}