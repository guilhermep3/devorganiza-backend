import { Response } from "express";
import {
  findAverageScore, findFasterAttempts, findFinishedTasksByMonth, findTasksByType, findWeeklyProductivity
} from "../services/chart.js"
import { ExtendedRequest } from "../types/request.js";

export const getWeeklyProductivity = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const weeklyProductivity = await findWeeklyProductivity(idLogged);

    res.json(weeklyProductivity);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar weekly-productivity",
      errorDetails: error,
    });
  }
}

export const getTasksByType = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const tasksByType = await findTasksByType(idLogged);

    res.json(tasksByType);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar tasks-by-type",
      errorDetails: error,
    });
  }
}

export const getFinishedTasksByMonth = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const finishedTasks = await findFinishedTasksByMonth(idLogged);

    res.json(finishedTasks);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar finished-tasks-by-month",
      errorDetails: error,
    });
  }
}

export const getAverageScore = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const averageScore = await findAverageScore(idLogged);

    res.json(averageScore);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar average-score",
      errorDetails: error,
    });
  }
}

export const getFasterAttempts = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const fasterAttempts = await findFasterAttempts(idLogged);

    res.json(fasterAttempts);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar faster-attempts",
      errorDetails: error,
    });
  }
}