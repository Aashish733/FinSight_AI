import TransactionModel from "../models/transaction.model";
import BudgetModel from "../models/budget.model";
import { genAI, genAIModel } from "../config/google-ai.config";
import { subDays } from "date-fns";
import { createUserContent } from "@google/genai";

export const chatWithAiService = async (userId: string, message: string) => {
  const thirtyDaysAgo = subDays(new Date(), 30);

  // Fetch recent transactions for context
  const transactions = await TransactionModel.find({
    userId,
    date: { $gte: thirtyDaysAgo },
  }).sort({ date: -1 });

  // Fetch budgets for context
  const budgets = await BudgetModel.find({ userId });

  // Format context for Gemini
  const transactionContext = transactions
    .map(
      (t) =>
        `- ${t.date.toISOString().split("T")[0]}: ${t.title} (${t.category}) - $${(
          t.amount / 100
        ).toFixed(2)} [${t.type}]`
    )
    .join("\n");

  const budgetContext = budgets
    .map(
      (b) =>
        `- ${b.category}: $${(b.amount / 100).toFixed(2)} limit`
    )
    .join("\n");

  const prompt = `
You are FinAI, a helpful financial assistant for the FinSight AI app. 
The user is asking you a question about their finances.

Context:
- User's recent transactions (last 30 days):
${transactionContext || "No recent transactions found."}

- User's active budgets:
${budgetContext || "No active budgets found."}

Instructions:
1. Provide concise, helpful, and accurate financial advice or answers based on the provided context.
2. If the user asks about their spending, count and sum the relevant transactions.
3. If they ask about budgets, relate it to their spending if possible.
4. Be professional but friendly.
5. If you don't have enough data to answer, be honest and ask for more details.

User Message: "${message}"
Response:
  `;

  const result = await genAI.models.generateContent({
    model: genAIModel,
    contents: [createUserContent(prompt)],
  });

  return result.text;
};
