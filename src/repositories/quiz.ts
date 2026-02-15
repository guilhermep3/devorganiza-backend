import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { alternativesTable, questionsTable, quizAttemptsTable, quizzesTable, userQuizzesTable } from "../db/schema";
import { db } from "../lib/drizzle";
import { quizInsert } from "../schemas/quiz";

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
  }
}