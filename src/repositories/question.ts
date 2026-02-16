import { eq } from "drizzle-orm";
import { alternativesTable, questionsTable } from "../db/schema";
import { db } from "../lib/drizzle";
import { AlternativeInsert, updateAlternativeType } from "../schemas/alternative";

export const questionRepositories = {
  async create(question: string, quizId: string) {
    return await db.insert(questionsTable)
      .values({ question, quizId })
      .returning().then(res => res[0]);
  },

  async createMany(data: { question: string; quizId: string }[]) {
    return await db.insert(questionsTable).values(data).returning();
  },

  async update(question: string, id: string) {
    return await db.update(questionsTable).set({ question })
      .where(eq(questionsTable.id, id))
      .returning().then(res => res[0]);
  },

  async delete(id: string) {
    return await db.delete(questionsTable)
      .where(eq(questionsTable.id, id));
  },

  async createAlternatives(data: AlternativeInsert[]) {
    return await db.insert(alternativesTable).values(data).returning();
  },

  async updateAlternative(data: updateAlternativeType, id: string) {
    return await db.update(alternativesTable).set(data)
      .where(eq(alternativesTable.id, id))
      .returning().then(res => res[0]);
  },

  async deleteAlternative(id: string) {
    return await db.delete(alternativesTable)
      .where(eq(alternativesTable.id, id));
  }
}