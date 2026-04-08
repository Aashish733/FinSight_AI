import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import { chatWithAiService } from "../services/ai.service";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
});

export const chatWithAiController = asyncHandler(
  async (req: Request, res: Response) => {
    const { message } = chatSchema.parse(req.body);
    const userId = req.user?._id;

    const response = await chatWithAiService(userId, message);

    return res.status(HTTPSTATUS.OK).json({
      message: "AI response fetched successfully",
      response,
    });
  }
);
