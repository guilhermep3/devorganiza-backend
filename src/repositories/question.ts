import { questionsTable } from "../db/schema";
import { db } from "../lib/drizzle";

export const questionRepositories = {
  async create(question: string, quizId: string) {
    return await db.insert(questionsTable)
      .values({ question, quizId })
      .returning().then(res => res[0]);
  }
}