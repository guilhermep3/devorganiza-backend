import { db } from "../lib/drizzle";
import { quizAttemptsTable, quizzesTable, studiesTable, tasksTable } from "../db/schema";
import { and, asc, desc, eq, sql } from "drizzle-orm";

export const findWeeklyProductivity = async (userId: string) => {
  const weekDay = sql<number>`EXTRACT(DOW FROM ${tasksTable.createdAt})`;

  return db
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
    .where(eq(studiesTable.userId, userId))
    .groupBy(weekDay);
};

export const findTasksByType = async (userId: string) => {
  return db.select({
    type: studiesTable.type,
    tasks: sql<number>`COUNT(${tasksTable.id})`
  })
    .from(studiesTable)
    .leftJoin(tasksTable, and(
      eq(tasksTable.studyId, studiesTable.id),
      eq(studiesTable.userId, userId)
    ))
    .groupBy(studiesTable.type)
};

export const findFinishedTasksByMonth = async (userId: string) => {
  const month = sql<number>`EXTRACT(month FROM ${tasksTable.createdAt})`;

  return db.select({
    month,
    tarefa: sql<number>`COUNT(${tasksTable.id})`
  })
    .from(studiesTable)
    .leftJoin(tasksTable, and(
      eq(tasksTable.studyId, studiesTable.id),
      eq(studiesTable.userId, userId)
    ))
    .groupBy(month)
};

export const findAverageScore = async (userId: string) => {
  return db
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
};

export const findFasterAttempts = async (userId: string) => {
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