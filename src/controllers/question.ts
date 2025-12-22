import type { Response } from "express"
import type { ExtendedRequest } from "../types/request.js"
import {
  createNewQuestion, createNewQuestions, deleteQuestionById, updateQuestionById
} from "../services/question.js";
import { createQuestionSchema, manyQuestionSchema, updateQuestionSchema } from "../schemas/question.js";

export const createQuestion = async (req: ExtendedRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;

    const safeData = createQuestionSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const newQuestion = await createNewQuestion(safeData.data.question, quizId);

    res.json(newQuestion);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pergunta do quiz", errorDetails: error });
    return;
  }
}

export const createManyQuestion = async (req: ExtendedRequest, res: Response) => {
  try {
    const safeData = manyQuestionSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const quizId = req.params.quizId as string;
    const questions = safeData.data.map(q => ({
      question: q.question,
      quizId
    }));

    const newQuestions = await createNewQuestions(questions);

    res.status(201).json(newQuestions);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar perguntas para o quiz", errorDetails: error });
    return;
  }
}

export const updateQuestion = async (req: ExtendedRequest, res: Response) => {
  try {
    const questionId = req.params.questionId as string;

    const safeData = updateQuestionSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const questionUpdated = await updateQuestionById(safeData.data.question, questionId);

    res.json(questionUpdated);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar pergunta do quiz", errorDetails: error });
    return;
  }
}

export const deleteQuestion = async (req: ExtendedRequest, res: Response) => {
  try {
    const questionId = req.params.questionId as string;

    await deleteQuestionById(questionId);

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar pergunta do quiz", errorDetails: error });
    return;
  }
}
