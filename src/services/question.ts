import { eq } from "drizzle-orm";
import { db } from "../lib/drizzle.js";
import { questionsTable, alternativesTable } from "../db/schema.js";

export const findQuestions = async (quizId: string) => {
  return await db.select().from(questionsTable)
    .where(eq(questionsTable.quizId, quizId));
};

export const createNewQuestion = async (question: string, quizId: string) => {
  return await db.insert(questionsTable)
    .values({ question, quizId })
    .returning().then(res => res[0]);
};

export const createNewQuestions = async (
  data: { question: string; quizId: string }[]
) => {
  return await db.insert(questionsTable).values(data).returning();
};

export const updateQuestionById = async (question: string, id: string) => {
  return await db.update(questionsTable).set({ question })
    .where(eq(questionsTable.id, id))
    .returning().then(res => res[0]);
};

export const deleteQuestionById = async (id: string) => {
  return await db.delete(questionsTable)
    .where(eq(questionsTable.id, id));
};

export const createNewAlternatives = async (data: typeof alternativesTable.$inferInsert[]) => {
  return await db.insert(alternativesTable).values(data).returning();
};

export const updateAlternativeById = async (
  data: Partial<typeof alternativesTable.$inferInsert>,
  id: string
) => {
  return await db.update(alternativesTable).set(data)
    .where(eq(alternativesTable.id, id))
    .returning().then(res => res[0]);
};

export const deleteAlternativeById = async (id: string) => {
  return await db.delete(alternativesTable)
    .where(eq(alternativesTable.id, id));
};