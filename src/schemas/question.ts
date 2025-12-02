import z from "zod";

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