import z from "zod";
import { studiesTable } from "../db/schema";

export type StudyInsert = typeof studiesTable.$inferInsert;
export type StudyUpdate = typeof updateStudySchema;

export const createStudySchema: z.ZodType<Omit<StudyInsert, 'userId'>> = z.object({
  name: z.string().min(1, "O título é obrigatório"),
  type: z.enum(["frontend", "backend", "outro"]),
  link: z.string().url("O link precisa ser uma URL válida").optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["em_andamento", "finalizado"]).default("em_andamento").optional(),
  progress: z.number().min(0, "O progresso não pode ser menor que 0")
    .max(100, "O progresso não pode ser maior que 100").optional(),
});

export const updateStudySchema = z.object({
  name: z.string().min(1, "O título é obrigatório").optional(),
  type: z.string().optional().nullable(),
  link: z.string().url("O link precisa ser uma URL válida").optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["em_andamento", "completo"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});
