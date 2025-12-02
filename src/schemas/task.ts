import z from "zod";
import { tasksTable } from "../db/schema";

export type TaskInsert = typeof tasksTable.$inferInsert;

export const createTaskSchema: z.ZodType<Omit<TaskInsert, 'studyId'>> = z.object({
  title: z.string().min(1, { message: "O título é obrigatório" }),
  link: z.string().url().optional(),
  finishIn: z.string().datetime().pipe(z.coerce.date()).optional()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório" }).optional(),
  link: z.string().url().optional(),
  finishIn: z.number().optional(),
  finishedAt: z.string().datetime().pipe(z.coerce.date()).optional()
});