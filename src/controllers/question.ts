import type { Response } from "express"
import type { ExtendedRequest } from "../types/request.js"
import {
  createNewQuestion, createNewQuestions, deleteQuestionById, updateQuestionById
} from "../services/question.js";
import { createManyQuestionType, createQuestionType, manyQuestionSchema, updateQuestionSchema, updateQuestionType } from "../schemas/question.js";

export const createQuestion = async (req: ExtendedRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;

    const data: createQuestionType = req.body;

    const newQuestion = await createNewQuestion(data.question, quizId);

    res.json(newQuestion);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pergunta do quiz", errorDetails: error });
    return;
  }
}

export const createManyQuestion = async (req: ExtendedRequest, res: Response) => {
  try {
    const data: createManyQuestionType = req.body;

    const quizId = req.params.quizId as string;
    const questions = data.map(q => ({
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

    const data: updateQuestionType = req.body;

    const questionUpdated = await updateQuestionById(data.question, questionId);

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
