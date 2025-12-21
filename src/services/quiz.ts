import { eq, desc, and, isNull, inArray, asc } from "drizzle-orm";
import { db } from "../lib/drizzle.js";
import {
  quizzesTable, userQuizzesTable, quizAttemptsTable, questionsTable, alternativesTable
} from "../db/schema.js";

export const createNewQuiz = async (
  data: typeof quizzesTable.$inferInsert
) => {
  return await db.insert(quizzesTable)
    .values(data)
    .returning().then(res => res[0]);
};

export const createNewQuizzes = async (
  data: { title: string; description?: string, type: string }[]
) => {
  return await db.insert(quizzesTable)
    .values(data).onConflictDoNothing().returning();
};

export const updateImageByQuiz = async (quizId: string, imageUrl: string) => {
  return await db.update(quizzesTable)
    .set({ imageUrl })
    .where(eq(quizzesTable.id, quizId))
    .returning().then(res => res[0]);
};

export const findQuiz = async (name: string) => {
  return await db.select().from(quizzesTable)
    .where(eq(quizzesTable.title, name))
    .limit(1).then(res => res[0]);
};

export const findQuizById = async (id: string) => {
  return await db.select().from(quizzesTable)
    .where(eq(quizzesTable.id, id))
    .limit(1).then(res => res[0]);
};

export const unlockUserQuiz = async (userId: string, quizId: string) => {
  return await db.insert(userQuizzesTable)
    .values({ userId, quizId })
    .returning().then(res => res[0]);
};

export const findUserQuizzes = async (userId: string) => {
  const rows = await db.select({
    quiz: quizzesTable,
    unlockedAt: userQuizzesTable.unlockedAt,
    attempt: quizAttemptsTable
  }).from(userQuizzesTable)
    .leftJoin(quizzesTable, eq(quizzesTable.id, userQuizzesTable.quizId))
    .leftJoin(
      quizAttemptsTable,
      and(
        eq(quizAttemptsTable.quizId, userQuizzesTable.quizId),
        eq(quizAttemptsTable.userId, userId)
      )
    )
    .where(eq(userQuizzesTable.userId, userId))
    .orderBy(asc(quizAttemptsTable.finishedAt));

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
  return await db.select().from(quizzesTable)
    .orderBy(asc(quizzesTable.id));
};

export const findLockedQuizzes = async (userId: string) => {
  const rows = await db.select({
    quiz: quizzesTable
  }).from(quizzesTable)
    .leftJoin(
      userQuizzesTable,
      and(
        eq(userQuizzesTable.quizId, quizzesTable.id),
        eq(userQuizzesTable.userId, userId)
      )
    )
    .where(isNull(userQuizzesTable.id));

  return rows.map(row => row.quiz);
};

export const findUserAttemtps = async (userId: string) => {
  return await db
    .select({
      id: quizAttemptsTable.id,
      quizId: quizAttemptsTable.quizId,
      quizTitle: quizzesTable.title,
      quizImage: quizzesTable.imageUrl,
      startedAt: quizAttemptsTable.startedAt,
      finishedAt: quizAttemptsTable.finishedAt,
      score: quizAttemptsTable.score,
      durationSec: quizAttemptsTable.durationSec,
    })
    .from(quizAttemptsTable)
    .leftJoin(
      quizzesTable,
      eq(quizAttemptsTable.quizId, quizzesTable.id)
    )
    .where(eq(quizAttemptsTable.userId, userId))
    .orderBy(desc(quizAttemptsTable.startedAt));
};

export const findFullQuiz = async (quizId: string) => {
  const quiz = await db.select().from(quizzesTable)
    .where(eq(quizzesTable.id, quizId))
    .limit(1).then(res => res[0]);

  if (!quiz) return null;

  const questions = await db.select().from(questionsTable)
    .where(eq(questionsTable.quizId, quizId));

  const questionIds = questions.map(q => q.id);

  const alternatives = questionIds.length
    ? await db.select().from(alternativesTable)
      .where(inArray(alternativesTable.questionId, questionIds))
    : [];

  const activeAttempt = await db.select().from(quizAttemptsTable)
    .where(
      and(
        eq(quizAttemptsTable.quizId, quizId),
        isNull(quizAttemptsTable.finishedAt)
      )
    )
    .orderBy(desc(quizAttemptsTable.startedAt))
    .limit(1).then(res => res[0] ?? null);

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
