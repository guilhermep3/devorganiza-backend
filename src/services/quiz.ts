import { quizzesTable } from "../db/schema.js";
import { quizInsert } from "../schemas/quiz.js";
import { quizRepository } from "../repositories/quiz.js";

export const createNewQuiz = async (data: typeof quizzesTable.$inferInsert) => {
  return await quizRepository.create(data);
};

export const createNewQuizzes = async (data: quizInsert[]) => {
  return await quizRepository.createMany(data);
};

export const updateImageByQuiz = async (quizId: string, imageUrl: string) => {
  return await quizRepository.updateImage(imageUrl, quizId);
};

export const findQuiz = async (name: string) => {
  return await quizRepository.findByName(name);
};

export const findQuizById = async (id: string) => {
  return await quizRepository.findById(id);
};

export const unlockUserQuiz = async (userId: string, quizId: string) => {
  return await quizRepository.unlock(userId, quizId);
};

export const findUserQuizzes = async (userId: string) => {
  const rows = await quizRepository.findUserQuizzes(userId);

  const map = new Map<string, any>();

  for (const row of rows) {
    if (!row.quiz) continue;

    const quizId = row.quiz.id;

    if (!map.has(quizId)) {
      map.set(quizId, {
        ...row.quiz,
        unlockedAt: row.unlockedAt,
        lastAttempt: row.attempt ?? null
      });
    }
  }

  return [...map.values()];
};

export const findAllQuizzes = async () => {
  return await quizRepository.findAll();
};

export const findLockedQuizzes = async (userId: string) => {
  const rows = await quizRepository.findLockedQuizzes(userId);

  return rows.map(row => row.quiz);
};

export const findUserAttemtps = async (userId: string) => {
  return await quizRepository.findUserAttemtps(userId);
};

export const findFullQuiz = async (quizId: string) => {
  const quiz = await quizRepository.findFullById(quizId);

  if (!quiz) return null;

  const questions = await quizRepository.findQuestions(quizId);

  const questionIds = questions.map(q => q.id);

  const alternatives = questionIds.length
    ? await quizRepository.findQuestionAlternatives(questionIds)
    : [];

  const activeAttempt = await quizRepository.findActiveAttempt(quizId);

  return {
    ...quiz,
    questions: questions.map(q => ({
      ...q,
      alternatives: alternatives
        .filter(a => a.questionId === q.id)
        .map(a => ({
          id: a.id,
          text: a.text,
          createdAt: a.createdAt
        }))
    })),
    quizAttempts: activeAttempt ? [activeAttempt] : []
  };
};

export const findUserQuiz = async (quizId: string, userId: string) => {
  const quiz = await findFullQuiz(quizId);
  if (!quiz) return null;

  const lastAttempt = await quizRepository.lastAttempt(userId, quizId)

  return {
    ...quiz,
    lastAttempt
  };
};

export const updateQuizById = async (
  quizId: string, data: Partial<typeof quizzesTable.$inferInsert>
) => {
  return await quizRepository.update(quizId, data)
};

export const startUserQuiz = async (userId: string, quizId: string) => {
  const existingAttempt = await quizRepository.existingAttempt(userId, quizId)

  if (existingAttempt) {
    return existingAttempt;
  }

  const newAttempt = await quizRepository.newAttempt(userId, quizId)

  return newAttempt;
};

export const findLastAttempt = async (userId: string, quizId: string) => {
  return await quizRepository.lastAttempt(userId, quizId)
};

export const findCorrectAnswers = async (quizId: string) => {
  const questions = await quizRepository.questions(quizId)

  const questionIds = questions.map(q => q.id);
  if (questionIds.length === 0) return [];

  return await quizRepository.correctAnswers(questionIds)
};

export const finishAttempt = async (attemptId: string, durationSec: number, score: number) => {
  return await quizRepository.finishLastAttempt(attemptId, durationSec, score)
};

export const deleteQuizAttemptById = async (id: string) => {
  return await quizRepository.deleteAttempt(id)
}

export const deleteQuizById = async (id: string) => {
  return await quizRepository.delete(id)
};
