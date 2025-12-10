import type { Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import {
  createUserStudy, deleteStudyById, findAllStudies, findUserStudies, findUserStudyById, findUserStudyByName, updateStudyById
} from "../services/study.js";
import { createStudySchema, updateStudySchema } from "../schemas/study.js";
import { pageSchema } from "../schemas/page.js";
import { findQuiz, unlockUserQuiz } from "../services/quiz.js";

export const getAllStudies = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged;

    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const safeData = pageSchema.safeParse(req.query);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const perPage = 10;
    const currentPage = safeData.data.page ?? 0;

    const studies = await findAllStudies(idLogged, perPage, currentPage);

    res.json(studies);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar todos os estudos",
      errorDetails: error
    });
  }
};

export const getStudies = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged;

    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const studies = await findUserStudies(idLogged);

    res.json(studies);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar estudos do usuário",
      errorDetails: error
    });
  }
};

export const getUserStudy = async (req: ExtendedRequest, res: Response) => {
  try {
    const studyId = req.params.id as string;

    const study = await findUserStudyById(studyId);

    if (!study) {
      res.status(404).json({ error: "Estudo não encontrado" });
      return;
    }

    res.json(study);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar um estudo",
      errorDetails: error
    });
  }
};

export const createStudy = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;

    if (!idLogged) {
      res.status(401).json({ error: "Acesso negado" });
      return;
    }

    const safeData = createStudySchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const haveStudy = await findUserStudyByName(
      safeData.data.name,
      idLogged
    );

    if (haveStudy && haveStudy.length > 0) {
      res.status(400).json({ error: "Já existe um estudo com o mesmo nome" });
      return;
    }

    const convertedData = {
      ...safeData.data,
      type: safeData.data.type ?? null,
      link: safeData.data.link ?? null,
      description: safeData.data.description ?? null,
      status: safeData.data.status ?? "em_andamento",
      progress: safeData.data.progress ?? 0
    };

    const newStudy = await createUserStudy({
      ...convertedData,
      userId: idLogged
    });

    const quiz = await findQuiz(safeData.data.name);

    if (quiz) {
      const quizUnlocked = await unlockUserQuiz(idLogged, quiz.id);

      res.status(201).json({
        study: newStudy,
        quiz: quizUnlocked
      });
      return;
    }

    res.status(201).json({ study: newStudy });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar estudo do usuário",
      errorDetails: error
    });
  }
};

export const updateStudy = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const studyId = req.params.id as string;

    if (!studyId) {
      res.status(400).json({ error: "Id do estudo inválido" });
      return;
    }

    const safeData = updateStudySchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(422).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(safeData.data).filter(([_, v]) => v !== undefined)
    );

    const updatedStudy = await updateStudyById(
      studyId,
      userId,
      cleanedData
    );

    res.json(updatedStudy);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar estudo",
      errorDetails: error
    });
  }
};

export const deleteStudy = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.idLogged as string;
    const studyId = req.params.id as string;

    if (!studyId) {
      res.status(400).json({ error: "Id do estudo inválido" });
      return;
    }

    await deleteStudyById(studyId, userId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar estudo",
      errorDetails: error
    });
  }
};
