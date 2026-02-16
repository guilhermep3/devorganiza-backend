import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { quizAttemptsTable, quizzesTable, studiesTable, tasksTable } from "../db/schema.js";
import { db } from "../lib/drizzle.js";

export const chartRepository = {
  async weeklyProductivity(userId: string) {
    const weekDay = sql<number>`EXTRACT(DOW FROM ${tasksTable.createdAt})`;

    return await db
      .select({
        weekDay,
        criado: sql<number>`COUNT(${tasksTable.studyId})`,
        finalizado: sql<number>`
            COUNT(${tasksTable.id})
            FILTER (WHERE ${tasksTable.done} IS TRUE)
          `,
      })
      .from(studiesTable)
      .leftJoin(
        tasksTable,
        eq(tasksTable.studyId, studiesTable.id)
      )
      .where(
        and(
          eq(studiesTable.userId, userId),
          isNotNull(tasksTable.createdAt)
        )
      )
      .groupBy(weekDay);
  },

  async tasksByType(userId: string) {
    return await db.select({
      type: studiesTable.type,
      tasks: sql<number>`COUNT(${tasksTable.id})`
    })
      .from(studiesTable)
      .leftJoin(tasksTable, and(
        eq(tasksTable.studyId, studiesTable.id),
        eq(studiesTable.userId, userId)
      ))
      .groupBy(studiesTable.type)
  },

  async finishedTasksByMonth(userId: string) {
    const month = sql<number>`EXTRACT(month FROM ${tasksTable.createdAt})`;

    return await db.select({
      month,
      tarefa: sql<number>`COUNT(${tasksTable.id})`
    })
      .from(studiesTable)
      .leftJoin(tasksTable, and(
        eq(tasksTable.studyId, studiesTable.id),
        eq(studiesTable.userId, userId)
      ))
      .groupBy(month)
  },

  async averageTimeFinish(userId: string) {
    return await db.select({
      estudo: studiesTable.name,
      media: sql<number>`ROUND(
          AVG(EXTRACT(EPOCH FROM (${tasksTable.finishedAt} - ${tasksTable.createdAt})) / 60)
        )`
    }).from(studiesTable)
      .leftJoin(tasksTable,
        eq(tasksTable.studyId, studiesTable.id),
      )
      .where(and(
        eq(studiesTable.userId, userId),
        isNotNull(tasksTable.finishedAt)
      ))
      .groupBy(studiesTable.name)
  },

  async averageScore(userId: string) {
    return await db
      .select({
        quizId: quizzesTable.id,
        quizTitle: quizzesTable.title,
        averageScore: sql<number>`AVG(${quizAttemptsTable.score})`,
        attempts: sql<number>`COUNT(${quizAttemptsTable.id})`
      })
      .from(quizzesTable)
      .leftJoin(
        quizAttemptsTable, and(
          eq(quizAttemptsTable.quizId, quizzesTable.id),
          eq(quizAttemptsTable.userId, userId)
        )
      )
      .groupBy(quizzesTable.id).orderBy(asc(quizzesTable.createdAt));
  },

  async fasterAttempts(userId: string) {
    const durationSeconds =
      sql<number>`EXTRACT(EPOCH FROM (${quizAttemptsTable.finishedAt} - ${quizAttemptsTable.startedAt}))`;

    return db.select({
      quiz: quizzesTable.title,
      duracao: durationSeconds
    })
      .from(quizAttemptsTable)
      .leftJoin(
        quizzesTable,
        eq(quizzesTable.id, quizAttemptsTable.quizId)
      )
      .where(eq(quizAttemptsTable.userId, userId))
      .orderBy(asc(durationSeconds))
  }
}