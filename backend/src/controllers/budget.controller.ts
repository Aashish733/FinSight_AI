import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import {
  upsertBudgetService,
  getBudgetsService,
  deleteBudgetService,
} from "../services/budget.service";
import { z } from "zod";

const budgetSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
});

export const upsertBudgetController = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, amount } = budgetSchema.parse(req.body);
    const userId = req.user?._id;

    const budget = await upsertBudgetService(userId, category, amount);

    return res.status(HTTPSTATUS.OK).json({
      message: "Budget updated successfully",
      budget,
    });
  }
);

export const getBudgetsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const budgets = await getBudgetsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Budgets fetched successfully",
      budgets,
    });
  }
);

export const deleteBudgetController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const budgetId = req.params.id; // Use a proper validator if available

    await deleteBudgetService(userId, budgetId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Budget deleted successfully",
    });
  }
);
