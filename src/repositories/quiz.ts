import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import {
  alternativesTable, questionsTable, quizAttemptsTable, quizzesTable, userQuizzesTable
} from "../db/schema.js";
import { db } from "../lib/drizzle.js";
import { quizInsert } from "../schemas/quiz.js";

export const quizRepository = {
  async create(data: typeof quizzesTable.$inferInsert) {
    return await db.insert(quizzesTable)
      .values(data)
      .returning().then(res => res[0]);
  },

  async createMany(data: quizInsert[]) {
    return await db.insert(quizzesTable)
      .values(data).onConflictDoNothing().returning();
  },

  async updateImage(imageUrl: string, quizId: string) {
    return await db.update(quizzesTable)
      .set({ imageUrl })
      .where(eq(quizzesTable.id, quizId))
      .returning().then(res => res[0]);
  },

  async findByName(name: string) {
    return await db.select().from(quizzesTable)
      .where(eq(quizzesTable.title, name))
      .limit(1).then(res => res[0]);
  },

  async findById(id: string) {
    return await db.select().from(quizzesTable)
      .where(eq(quizzesTable.id, id))
      .limit(1).then(res => res[0]);
  },

  async unlock(userId: string, quizId: string) {
    return await db.insert(userQuizzesTable)
      .values({ userId, quizId })
      .returning().then(res => res[0]);
  },

  async findUserQuizzes(userId: string) {
    return await db.select({
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
  },

  async findAll() {
    return await db.select().from(quizzesTable)
      .orderBy(asc(quizzesTable.id));
  },

  async findLockedQuizzes(userId: string) {
    return await db.select({ quiz: quizzesTable }).from(quizzesTable)
      .leftJoin(
        userQuizzesTable,
        and(
          eq(userQuizzesTable.quizId, quizzesTable.id),
          eq(userQuizzesTable.userId, userId)
        )
      )
      .where(isNull(userQuizzesTable.id));
  },

  async findUserAttemtps(userId: string) {
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
  },

  async findFullById(quizId: string) {
    return await db.select().from(quizzesTable)
      .where(eq(quizzesTable.id, quizId))
      .limit(1).then(res => res[0]);
  },

  async findQuestions(quizId: string) {
    return await db.select().from(questionsTable)
      .where(eq(questionsTable.quizId, quizId));
  },

  async findQuestionAlternatives(questionIds: string[]) {
    return await db.select().from(alternativesTable)
      .where(inArray(alternativesTable.questionId, questionIds))
  },

  async findActiveAttempt(quizId: string) {
    return await db.select().from(quizAttemptsTable)
      .where(
        and(
          eq(quizAttemptsTable.quizId, quizId),
          isNull(quizAttemptsTable.finishedAt)
        )
      )
      .orderBy(desc(quizAttemptsTable.startedAt))
      .limit(1).then(res => res[0] ?? null);
  },

  async update(quizId: string, data: Partial<typeof quizzesTable.$inferInsert>) {
    return await db.update(quizzesTable)
      .set(data)
      .where(eq(quizzesTable.id, quizId))
      .returning().then(res => res[0]);
  },

  async existingAttempt(userId: string, quizId: string) {
    return await db.select().from(quizAttemptsTable)
      .where(and(
        eq(quizAttemptsTable.userId, userId),
        eq(quizAttemptsTable.quizId, quizId),
        isNull(quizAttemptsTable.finishedAt)
      )).limit(1)
      .then(res => res[0] ?? null);
  },

  async newAttempt(userId: string, quizId: string) {
    return await db.insert(quizAttemptsTable)
      .values({ userId, quizId })
      .returning().then(res => res[0]);
  },

  async lastAttempt(userId: string, quizId: string) {
    return await db.select().from(quizAttemptsTable)
      .where(
        and(
          eq(quizAttemptsTable.userId, userId),
          eq(quizAttemptsTable.quizId, quizId)
        )
      )
      .orderBy(desc(quizAttemptsTable.startedAt))
      .limit(1).then(res => res[0]);
  },

  async questions(quizId: string) {
    return await db.select().from(questionsTable)
      .where(eq(questionsTable.quizId, quizId));
  },

  async correctAnswers(questionIds: string[]) {
    return await db.select().from(alternativesTable)
      .where(
        and(
          eq(alternativesTable.isCorrect, true),
          inArray(alternativesTable.questionId, questionIds)
        )
      );
  },

  async finishLastAttempt(attemptId: string, durationSec: number, score: number) {
    return await db.update(quizAttemptsTable)
      .set({
        durationSec,
        score,
        finishedAt: new Date()
      })
      .where(eq(quizAttemptsTable.id, attemptId))
      .returning().then(res => res[0]);
  },

  async deleteAttempt(id: string) {
    return await db.delete(quizAttemptsTable)
      .where(eq(quizAttemptsTable.id, id))
  },

  async delete(id: string) {
    return await db.delete(quizzesTable)
      .where(eq(quizzesTable.id, id));
  }
}