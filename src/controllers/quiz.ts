import type { Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import {
  createNewQuiz, createNewQuizzes, deleteQuizAttemptById, deleteQuizById, findAllQuizzes, findCorrectAnswers, findFullQuiz, findLastAttempt,
  findLockedQuizzes, findQuizById, findUserAttemtps, findUserQuiz, findUserQuizzes, finishAttempt,
  startUserQuiz, unlockUserQuiz, updateImageByQuiz, updateQuizById
} from "../services/quiz.js";
import { attemptAnswersSchema, createQuizSchema, createQuizzesSchema, updateQuizSchema } from "../schemas/quiz.js";
import cloudinary from "../utils/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { calculateDuration } from "../utils/calculateDuration.js";

export const getQuizzes = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const userQuizzes = await findUserQuizzes(idLogged);

    res.json(userQuizzes);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar todos os quizzes do usuário", errorDetails: error });
    return;
  }
}

export const getAllQuizzes = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const userQuizzes = await findAllQuizzes();

    res.json(userQuizzes);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar todos os quizzes do usuário", errorDetails: error });
    return;
  }
}

export const getLockedQuizzes = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizzes = await findLockedQuizzes(idLogged);

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar quizzes não desbloqueados",
      errorDetails: error
    });
  }
};

export const getUserAttempts = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const attempts = await findUserAttemtps(idLogged);

    res.json(attempts);
    return;
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscas tentativas de quiz do usuário",
      errorDetails: error
    })
  }
}

export const createQuiz = async (req: ExtendedRequest, res: Response) => {
  try {
    const safeData = createQuizSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const newQuiz = await createNewQuiz(safeData.data);

    res.status(201).json(newQuiz);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar um quiz", errorDetails: error });
    return;
  }
}

export const createManyQuiz = async (req: ExtendedRequest, res: Response) => {
  try {
    const safeData = createQuizzesSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const newQuizzes = await createNewQuizzes(safeData.data);

    res.status(201).json({ message: "Quizzes criados com sucesso!", newQuizzes });
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar quizzes", errorDetails: error });
    return;
  }
};

export const getQuiz = async (req: ExtendedRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;

    const fullQuiz = await findFullQuiz(quizId);

    if (!fullQuiz) {
      res.status(404).json({ error: "Quiz não encontrado" });
      return;
    }

    res.status(200).json(fullQuiz);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar quiz", errorDetails: error });
  }
}

export const updateQuiz = async (req: ExtendedRequest, res: Response) => {
  try {
    const safeData = updateQuizSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizId = req.params.quizId as string;

    const convertedData = {
      ...safeData.data,
      title: safeData.data.title!,
      description: safeData.data.description!
    }

    const quizUpdated = await updateQuizById(quizId, convertedData);

    res.json(quizUpdated);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar um quiz", errorDetails: error });
    return;
  }
}

export const deleteQuiz = async (req: ExtendedRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;

    const haveQuiz = await findQuizById(quizId);

    if (haveQuiz) {
      await deleteQuizById(quizId);
    } else {
      res.status(400).json({ error: "Quiz inexistente" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar quiz", errorDetails: error });
    return;
  }
}

export const unlockQuiz = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizId = req.params.quizId as string;

    const quizUnlocked = await unlockUserQuiz(idLogged, quizId);

    res.json(quizUnlocked);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao desbloquear quiz", errorDetails: error });
    return;
  }
}

export const updateQuizImage = async (req: ExtendedRequest, res: Response) => {
  try {
    const quizId = req.params.quizId as string;

    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
      return;
    }

    const quiz = await findQuizById(quizId);
    if (!quiz) {
      res.status(404).json({ error: "Quiz não encontrado." });
      return;
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, "Quizzes");

    if (quiz.imageUrl) {
      const publicId = imageUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`Quizzes/${publicId}`);
      }
    }

    const updatedQuiz = await updateImageByQuiz(quizId, imageUrl);

    res.status(200).json({
      message: `Imagem ${quiz?.imageUrl ? "atualizada" : "adicionada"} com sucesso!`,
      imageUrl,
      user: updatedQuiz,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar a imagem do quiz", errorDetails: error });
    return;
  }
}

export const getLastQuizAttempt = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizId = req.params.quizId as string;
    if (!quizId) {
      res.status(400).json({ error: "Quiz não informado." });
      return;
    }

    const quiz = await findUserQuiz(quizId, idLogged);
    if (!quiz) {
      res.status(404).json({ error: "Quiz não encontrado." });
      return;
    }

    const lastAttempt = await findLastAttempt(idLogged, quizId);

    if (!lastAttempt) {
      res.status(404).json({ error: "Nenhuma tentativa encontrada para este quiz." });
      return;
    }

    res.status(200).json(lastAttempt);
    return;
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar última tentativa do quiz",
      errorDetails: error,
    });
    return;
  }
};

export const startQuizAttempt = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizId = req.params.quizId as string;

    const quiz = await findUserQuiz(quizId, idLogged);
    if (!quiz) {
      res.status(400).json({ error: "Quiz não encontrado" });
      return;
    }

    const newAttempt = await startUserQuiz(idLogged, quizId);

    res.status(201).json(newAttempt);
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao iniciar tentativa do quiz", errorDetails: error });
    return;
  }
}

export const finishQuizAttempt = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizId = req.params.quizId as string;

    const quiz = await findUserQuiz(quizId, idLogged);
    if (!quiz) {
      res.status(400).json({ error: "Quiz não encontrado" });
      return;
    }

    const safeData = attemptAnswersSchema.safeParse(req.body);
    if (!safeData.success) {
      res.status(400).json({ error: safeData.error.flatten().fieldErrors });
      return;
    }

    const answers = safeData.data;

    const correctAnswersMap = await findCorrectAnswers(quizId);

    let score = 0;

    answers.forEach((answer) => {
      const correct = correctAnswersMap.find((a: any) =>
        a.questionId === answer.questionId && a.id === answer.answerId
      )
      if (correct) score++
    })

    const lastAttempt = await findLastAttempt(idLogged, quizId);
    if (!lastAttempt) {
      res.status(400).json({ error: "Última tentativa não encontrada" });
      return;
    }

    const startedAt = lastAttempt.startedAt;
    const currentTime = new Date();
    const { minutes, seconds, remainingSeconds } = calculateDuration(startedAt, currentTime);

    const attemptFinished = await finishAttempt(
      lastAttempt.id,
      seconds,
      score
    )

    res.json({
      attempt: attemptFinished,
      duration: seconds,
      score,
      message: `${minutes} minutos e ${remainingSeconds} segundos`
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Erro ao finalizar tentativa do quiz", errorDetails: error });
    return;
  }
}

export const deleteQuizAttempt = async (req: ExtendedRequest, res: Response) => {
  try {
    const idLogged = req.idLogged as string;
    if (!idLogged) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    const quizId = req.params.quizId as string;

    const quiz = await findUserQuiz(quizId, idLogged);
    if (!quiz) {
      res.status(400).json({ error: "Quiz não encontrado." });
      return;
    }

    const lastAttempt = await findLastAttempt(idLogged, quizId);
    if (!lastAttempt) {
      res.status(404).json({ error: "Tentativa não encontrada." });
      return;
    }

    if (lastAttempt.finishedAt) {
      res.status(400).json({ error: "Esta tentativa já foi finalizada." });
      return;
    }

    await deleteQuizAttemptById(lastAttempt.id);

    res.status(200).json({
      message: "Tentativa do quiz cancelada com sucesso.",
    });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Erro ao cancelar tentativa do quiz",
      errorDetails: error,
    });
    return;
  }
};
