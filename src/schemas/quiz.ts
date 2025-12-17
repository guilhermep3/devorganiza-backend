import z from "zod";

export const createQuizSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string()
})

export const createQuizzesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    type: z.string()
  })
)

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