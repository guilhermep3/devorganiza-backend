import z from "zod";
import { boxesTable, notesTable } from "../db/schema.js";

export type NoteInsert = typeof notesTable.$inferInsert;
export type NoteSelect = typeof notesTable.$inferSelect;
export type BoxInsert = typeof boxesTable.$inferInsert;
export type BoxSelect = typeof boxesTable.$inferSelect;

// ---------- Conteúdo dos blocos ----------

const textContentSchema = z.object({
  text: z.string(),
});

const listContentSchema = z.object({
  ordered: z.boolean(),
  items: z.array(
    z.object({ text: z.string() })
  ),
});

const tableContentSchema = z.object({
  columns: z.array(z.string()).min(1).max(4),
  rows: z.array(z.array(z.string())).max(10),
});

export const boxContentSchema = z.union([
  textContentSchema,
  listContentSchema,
  tableContentSchema,
]);

// ---------- Schemas de entrada ----------

export const createNoteSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
});

export const updateNoteSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo").optional(),
});

export const createBoxSchema = z.object({
  type: z.enum(["text", "list", "table"]),
  content: boxContentSchema,
  position: z.number().int().min(0),
});

export const updateBoxSchema = z.object({
  type: z.enum(["text", "list", "table"]).optional(),
  content: boxContentSchema.optional(),
  position: z.number().int().min(0).optional(),
});

export const reorderBoxesSchema = z.object({
  boxes: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
});

// ---------- Tipos inferidos ----------

export type CreateNoteType = z.infer<typeof createNoteSchema>;
export type UpdateNoteType = z.infer<typeof updateNoteSchema>;
export type CreateBoxType = z.infer<typeof createBoxSchema>;
export type UpdateBoxType = z.infer<typeof updateBoxSchema>;
export type ReorderBoxesType = z.infer<typeof reorderBoxesSchema>;