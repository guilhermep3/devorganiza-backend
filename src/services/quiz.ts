import { eq, desc, and, isNull, inArray, asc } from "drizzle-orm";
import { db } from "../lib/drizzle.js";
import {
  quizzesTable, userQuizzesTable, quizAttemptsTable, questionsTable, alternativesTable
} from "../db/schema.js";
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

  const lastAttempt = await db.select().from(quizAttemptsTable)
    .where(
      and(
        eq(quizAttemptsTable.quizId, quizId),
        eq(quizAttemptsTable.userId, userId)
      )
    )
    .orderBy(desc(quizAttemptsTable.finishedAt))
    .limit(1).then(res => res[0] ?? null);

  return {
    ...quiz,
    lastAttempt
  };
};

export const updateQuizById = async (
  quizId: string,
  data: Partial<typeof quizzesTable.$inferInsert>
) => {
  return await db.update(quizzesTable)
    .set(data)
    .where(eq(quizzesTable.id, quizId))
    .returning().then(res => res[0]);
};

export const startUserQuiz = async (userId: string, quizId: string) => {
  const existingAttempt = await db.select().from(quizAttemptsTable)
    .where(and(
      eq(quizAttemptsTable.userId, userId),
      eq(quizAttemptsTable.quizId, quizId),
      isNull(quizAttemptsTable.finishedAt)
    )).limit(1)
    .then(res => res[0] ?? null);

  if (existingAttempt) {
    return existingAttempt;
  }

  const newAttempt = await db.insert(quizAttemptsTable)
    .values({ userId, quizId })
    .returning().then(res => res[0]);

  return newAttempt;
};

export const findLastAttempt = async (userId: string, quizId: string) => {
  return await db.select().from(quizAttemptsTable)
    .where(
      and(
        eq(quizAttemptsTable.userId, userId),
        eq(quizAttemptsTable.quizId, quizId)
      )
    )
    .orderBy(desc(quizAttemptsTable.startedAt))
    .limit(1).then(res => res[0]);
};

export const findCorrectAnswers = async (quizId: string) => {
  const questions = await db.select().from(questionsTable)
    .where(eq(questionsTable.quizId, quizId));

  const questionIds = questions.map(q => q.id);
  if (questionIds.length === 0) return [];

  return await db.select().from(alternativesTable)
    .where(
      and(
        eq(alternativesTable.isCorrect, true),
        inArray(alternativesTable.questionId, questionIds)
      )
    );
};

export const finishAttempt = async (
  attemptId: string,
  durationSec: number,
  score: number
) => {
  return await db.update(quizAttemptsTable)
    .set({
      durationSec,
      score,
      finishedAt: new Date()
    })
    .where(eq(quizAttemptsTable.id, attemptId))
    .returning().then(res => res[0]);
};

export const deleteQuizAttemptById = async (id: string) => {
  return await db.delete(quizAttemptsTable)
    .where(eq(quizAttemptsTable.id, id))
}

export const deleteQuizById = async (id: string) => {
  return await db.delete(quizzesTable)
    .where(eq(quizzesTable.id, id));
};
