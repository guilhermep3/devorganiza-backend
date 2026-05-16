import z from "zod";
import { blocksTable, notesTable } from "../db/schema.js";

export type NoteInsert = typeof notesTable.$inferInsert;
export type NoteSelect = typeof notesTable.$inferSelect;
export type BlockInsert = typeof blocksTable.$inferInsert;
export type BlockSelect = typeof blocksTable.$inferSelect;

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

export const blockContentSchema = z.union([
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

export const createBlockSchema = z.object({
  type: z.enum(["text", "list", "table"]),
  content: blockContentSchema,
  position: z.number().int().min(0),
});

export const updateBlockSchema = z.object({
  type: z.enum(["text", "list", "table"]).optional(),
  content: blockContentSchema.optional(),
  position: z.number().int().min(0).optional(),
});

export const reorderBlocksSchema = z.object({
  blocks: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
});

// ---------- Tipos inferidos ----------

export type CreateNoteType = z.infer<typeof createNoteSchema>;
export type UpdateNoteType = z.infer<typeof updateNoteSchema>;
export type CreateBlockType = z.infer<typeof createBlockSchema>;
export type UpdateBlockType = z.infer<typeof updateBlockSchema>;
export type ReorderBlocksType = z.infer<typeof reorderBlocksSchema>;