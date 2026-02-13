import { z } from "zod";
import { quizzesTable } from "../db/schema";

export type quizInsert = typeof quizzesTable.$inferInsert;
export type attemptAnswersType = z.infer<typeof attemptAnswersSchema>[number];

export const createQuizzesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    type: z.string()
  })
)

export const createQuizSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string()
})

export const updateQuizSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
})

export const attemptAnswersSchema = z.array(
  z.object({
    questionId: z.string(),
    answerId: z.string()
  })
);