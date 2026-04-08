import { Router } from "express";
import { chatWithAiController } from "../controllers/ai.controller";

const aiRoutes = Router();

aiRoutes.post("/chat", chatWithAiController);

export default aiRoutes;
