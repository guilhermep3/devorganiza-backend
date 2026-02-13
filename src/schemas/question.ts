import z from "zod";

export type createQuestionType = z.infer<typeof createQuestionSchema>;
export type createManyQuestionType = z.infer<typeof manyQuestionSchema>;
export type updateQuestionType = z.infer<typeof updateQuestionSchema>;

export const createQuestionSchema = z.object({
  question: z.string()
})

export const manyQuestionSchema = z.array(
  z.object({
    question: z.string()
  })
)

export const updateQuestionSchema = z.object({
  question: z.string()
})