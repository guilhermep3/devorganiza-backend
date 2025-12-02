import { createAlternativeSchema, createManyAlternativeSchema, updateAlternativeSchema } from "../schemas/alternative.js";
import {
  createNewAlternative, createNewAlternatives, deleteAlternativeById,
  findAlternatives, updateAlternativeById
} from "../services/question.js";
import type { ExtendedRequest } from "../types/request.js";
import type { Response } from "express";

export const getAlternatives = async (req: ExtendedRequest, res: Response) => {
  try {
    const questionId = Number(req.params.questionId);
    if (!questionId) {
      res.status(400).json({ error: "Acesso negado" });
      return;
    }

    const alternatives = await findAlternatives(questionId);

    res.json(alternatives)
  } catch (error) {
    res.status(500).json({ error: "Erro ao pegar todas as alternativas do quiz", errorDetails: error });
  }
}

export const createAlternatives = async (req: ExtendedRequest, res: Response) => {
  try {
    const questionId = Number(req.params.questionId);

    const safeData = createAlternativeSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const newAlternative = await createNewAlternative(safeData.data);

    res.status(201).json(newAlternative);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar pergunta do quiz", errorDetails: error });
  }
}

export const createManyAlternatives = async (req: ExtendedRequest, res: Response) => {
  try {
    const safeData = createManyAlternativeSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const alternatives = safeData.data.map((a: any) => ({
      text: a.text,
      isCorrect: a.isCorrect,
      questionId: a.questionId
    }))

    const newAlternative = await createNewAlternatives(alternatives);

    res.status(201).json(newAlternative);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar alternativas do quiz", errorDetails: error });
  }
}

export const updateAlternative = async (req: ExtendedRequest, res: Response) => {
  try {
    const alternativeId = Number(req.params.alternativeId);

    const safeData = updateAlternativeSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const convertedData = {
      ...safeData.data,
      text: safeData.data.text!,
      isCorrect: safeData.data.isCorrect!
    }

    const newAlternative = await updateAlternativeById(convertedData, alternativeId);

    res.status(201).json(newAlternative);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar alternativa", errorDetails: error });
  }
}

export const deleteAlternative = async (req: ExtendedRequest, res: Response) => {
  try {
    const alternativeId = Number(req.params.alternativeId);

    await deleteAlternativeById(alternativeId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar alternativa", errorDetails: error });
  }
}