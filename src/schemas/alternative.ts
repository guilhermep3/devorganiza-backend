import z from "zod";
import { alternativesTable } from "../db/schema";

export type AlternativeInsert = typeof alternativesTable.$inferInsert;
export type AlternativeUpdate = Partial<AlternativeInsert>;

export const createAlternativeSchema: z.ZodType<AlternativeInsert> = z.object({
  text: z.string(),
  isCorrect: z.boolean().default(false),
  questionId: z.string(),
})

export const createManyAlternativeSchema: z.ZodType<AlternativeInsert[]> = z.array(
  z.object({
    text: z.string(),
    isCorrect: z.boolean().default(false),
    questionId: z.string()
  })
)

export const updateAlternativeSchema = z.object({
  text: z.string().optional(),
  isCorrect: z.boolean().default(false).optional()
})