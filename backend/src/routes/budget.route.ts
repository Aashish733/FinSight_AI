import { Router } from "express";
import {
  upsertBudgetController,
  getBudgetsController,
  deleteBudgetController,
} from "../controllers/budget.controller";

const budgetRoutes = Router();

budgetRoutes.get("/", getBudgetsController);
budgetRoutes.post("/", upsertBudgetController);
budgetRoutes.delete("/:id", deleteBudgetController);

export default budgetRoutes;
