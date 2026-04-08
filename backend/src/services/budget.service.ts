import mongoose from "mongoose";
import BudgetModel from "../models/budget.model";
import TransactionModel, {
  TransactionTypeEnum,
} from "../models/transaction.model";
import UserModel from "../models/user.model";
import { startOfMonth, endOfMonth } from "date-fns";
import { sendEmail } from "../mailers/mailer";

export const upsertBudgetService = async (
  userId: string,
  category: string,
  amount: number
) => {
  return await BudgetModel.findOneAndUpdate(
    { userId, category },
    { amount, period: "Monthly" },
    { upsert: true, new: true }
  );
};

export const getBudgetsService = async (userId: string) => {
  const budgets = await BudgetModel.find({ userId });
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const budgetUsage = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await TransactionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            category: budget.category,
            type: TransactionTypeEnum.EXPENSE,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: { $abs: "$amount" } },
          },
        },
      ]);

      const totalSpent = spent.length > 0 ? spent[0].totalSpent : 0;
      return {
        ...budget.toObject(),
        totalSpent,
        usagePercentage: (totalSpent / budget.amount) * 100,
      };
    })
  );

  return budgetUsage;
};

export const deleteBudgetService = async (userId: string, budgetId: string) => {
  return await BudgetModel.findOneAndDelete({ _id: budgetId, userId });
};

export const checkBudgetLimitsService = async (
  userId: string,
  category: string
) => {
  const [budget, user] = await Promise.all([
    BudgetModel.findOne({ userId, category }),
    UserModel.findById(userId),
  ]);

  if (!budget || !user) return;

  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const spent = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        category,
        type: TransactionTypeEnum.EXPENSE,
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: { $abs: "$amount" } },
      },
    },
  ]);

  const totalSpent = spent.length > 0 ? spent[0].totalSpent : 0;
  const usagePercentage = (totalSpent / budget.amount) * 100;

  if (usagePercentage >= 100) {
    await sendEmail({
      to: user.email,
      subject: `🚨 Budget Exceeded: ${category}`,
      text: `You have exceeded your budget for ${category}. Total spent: $${(
        totalSpent / 100
      ).toFixed(2)} out of $${(budget.amount / 100).toFixed(2)}.`,
      html: `<h1>Budget Exceeded</h1><p>You have exceeded your budget for <strong>${category}</strong>.</p><p>Total spent: <strong>$${(
        totalSpent / 100
      ).toFixed(2)}</strong> out of $${(budget.amount / 100).toFixed(
        2
      )}.</p>`,
    });
  } else if (usagePercentage >= 80) {
    await sendEmail({
      to: user.email,
      subject: `⚠️ Budget Warning: ${category}`,
      text: `You have reached ${usagePercentage.toFixed(
        0
      )}% of your budget for ${category}. Total spent: $${(
        totalSpent / 100
      ).toFixed(2)} out of $${(budget.amount / 100).toFixed(2)}.`,
      html: `<h1>Budget Warning</h1><p>You have reached <strong>${usagePercentage.toFixed(
        0
      )}%</strong> of your budget for <strong>${category}</strong>.</p><p>Total spent: <strong>$${(
        totalSpent / 100
      ).toFixed(2)}</strong> out of $${(budget.amount / 100).toFixed(
        2
      )}.</p>`,
    });
  }
};
