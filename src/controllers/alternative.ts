import { createManyAlternativesType, updateAlternativeType } from "../schemas/alternative.js";
import {
  createNewAlternatives, deleteAlternativeById, updateAlternativeById
} from "../services/question.js";
import type { ExtendedRequest } from "../types/request.js";
import type { Response } from "express";

export const createManyAlternatives = async (req: ExtendedRequest, res: Response) => {
  try {
    const data: createManyAlternativesType[] = req.body;

    const alternatives = data.map((a: any) => ({
      text: a.text,
      isCorrect: a.isCorrect,
      questionId: a.questionId as string
    }))

    const newAlternative = await createNewAlternatives(alternatives);

    res.status(201).json(newAlternative);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar alternativas do quiz", errorDetails: error });
  }
}

export const updateAlternative = async (req: ExtendedRequest, res: Response) => {
  try {
    const alternativeId = req.params.alternativeId as string;

    if (!alternativeId) {
      res.status(400).json({ error: "Acesso negado" });
      return;
    }

    const data: updateAlternativeType = req.body;

    const convertedData = {
      ...data,
      text: data.text,
      isCorrect: data.isCorrect
    }

    const newAlternative = await updateAlternativeById(convertedData, alternativeId);

    res.status(201).json(newAlternative);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar alternativa", errorDetails: error });
  }
}

export const deleteAlternative = async (req: ExtendedRequest, res: Response) => {
  try {
    const alternativeId = req.params.alternativeId as string;

    if (!alternativeId) {
      res.status(400).json({ error: "Acesso negado" });
      return;
    }

    await deleteAlternativeById(alternativeId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar alternativa", errorDetails: error });
  }
}
