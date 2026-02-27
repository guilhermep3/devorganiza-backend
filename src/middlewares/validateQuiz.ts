import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import { findQuizById } from "../services/quiz.js";

export const validateQuiz = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const quizId = req.params.quizId as string;

  if (!quizId) {
    return res.status(400).json({ error: "Quiz inválido." });
  }

  const quiz = await findQuizById(quizId);

  if (!quiz) {
    return res.status(404).json({ error: "Quiz não encontrado." });
  }

  next();
};