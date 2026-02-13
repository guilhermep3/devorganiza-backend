import z from "zod";
import { alternativesTable } from "../db/schema";

export type AlternativeInsert = typeof alternativesTable.$inferInsert;
export type AlternativeUpdate = Partial<AlternativeInsert>;
export type createManyAlternativesType = z.infer<typeof createManyAlternativesSchema>;
export type updateAlternativeType = z.infer<typeof updateAlternativeSchema>;

export const createManyAlternativesSchema = z.array(
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