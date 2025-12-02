import { eq } from "drizzle-orm";
import { db } from "../lib/drizzle";
import { questionsTable, alternativesTable } from "../db/schema";

export const findQuestions = async (quizId: number) => {
  return await db.select().from(questionsTable)
    .where(eq(questionsTable.quizId, quizId));
};

export const createNewQuestion = async (question: string, quizId: number) => {
  return await db.insert(questionsTable)
    .values({ question, quizId })
    .returning()
    .then(res => res[0]);
};

export const createNewQuestions = async (
  data: { question: string; quizId: number }[]
) => {
  return await db.insert(questionsTable).values(data).returning();
};

export const updateQuestionById = async (question: string, id: number) => {
  return await db.update(questionsTable)
    .set({ question })
    .where(eq(questionsTable.id, id))
    .returning()
    .then(res => res[0]);
};

export const deleteQuestionById = async (id: number) => {
  return await db.delete(questionsTable)
    .where(eq(questionsTable.id, id));
};


// ALTERNATIVES

export const findAlternatives = async (questionId: number) => {
  return await db.select().from(alternativesTable)
    .where(eq(alternativesTable.questionId, questionId));
};

export const createNewAlternative = async (data: typeof alternativesTable.$inferInsert) => {
  return await db.insert(alternativesTable)
    .values(data)
    .returning()
    .then(res => res[0]);
};

export const createNewAlternatives = async (data: typeof alternativesTable.$inferInsert[]) => {
  return await db.insert(alternativesTable).values(data).returning();
};

export const updateAlternativeById = async (
  data: Partial<typeof alternativesTable.$inferInsert>,
  id: number
) => {
  return await db.update(alternativesTable)
    .set(data)
    .where(eq(alternativesTable.id, id))
    .returning()
    .then(res => res[0]);
};

export const deleteAlternativeById = async (id: number) => {
  return await db.delete(alternativesTable)
    .where(eq(alternativesTable.id, id));
};
