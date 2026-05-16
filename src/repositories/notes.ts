import { and, asc, desc, eq } from "drizzle-orm";
import { blocksTable, notesTable } from "../db/schema.js";
import { db } from "../lib/drizzle.js";
import { CreateBlockType , CreateNoteType, UpdateBlockType, UpdateNoteType } from "../schemas/notes.js";

export const notesRepository = {
  // ---------- Notes ----------

  async findAllByUser(userId: string) {
    return await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, userId))
      .orderBy(desc(notesTable.updatedAt));
  },

  async findById(id: string, userId: string) {
    return await db
      .select()
      .from(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .limit(1)
      .then((res) => res[0]);
  },

  async create(data: CreateNoteType, userId: string) {
    return await db
      .insert(notesTable)
      .values({ ...data, userId })
      .returning()
      .then((res) => res[0]);
  },

  async update(id: string, userId: string, data: UpdateNoteType) {
    return await db
      .update(notesTable)
      .set(data)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .returning()
      .then((res) => res[0]);
  },

  async delete(id: string, userId: string) {
    return await db
      .delete(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, userId)))
      .returning()
      .then((res) => res[0]);
  },

  // ---------- Blocks ----------

  async findBlocksByNote(notesId: string, userId: string) {
    return await db
      .select()
      .from(blocksTable)
      .where(and(eq(blocksTable.notesId, notesId), eq(blocksTable.userId, userId)))
      .orderBy(asc(blocksTable.position));
  },

  async findBlockById(id: string, userId: string) {
    return await db
      .select()
      .from(blocksTable)
      .where(and(eq(blocksTable.id, id), eq(blocksTable.userId, userId)))
      .limit(1)
      .then((res) => res[0]);
  },

  async createBlock(notesId: string, userId: string, data: CreateBlockType) {
    return await db
      .insert(blocksTable)
      .values({ ...data, notesId, userId })
      .returning()
      .then((res) => res[0]);
  },

  async updateBlock(id: string, userId: string, data: UpdateBlockType) {
    return await db
      .update(blocksTable)
      .set(data)
      .where(and(eq(blocksTable.id, id), eq(blocksTable.userId, userId)))
      .returning()
      .then((res) => res[0]);
  },

  async deleteBlock(id: string, userId: string) {
    return await db
      .delete(blocksTable)
      .where(and(eq(blocksTable.id, id), eq(blocksTable.userId, userId)))
      .returning()
      .then((res) => res[0]);
  },

  async reorderBlocks(updates: { id: string; position: number }[], userId: string) {
    return await db.transaction(async (tx) => {
      const results = [];
      for (const { id, position } of updates) {
        const updated = await tx
          .update(blocksTable)
          .set({ position })
          .where(and(eq(blocksTable.id, id), eq(blocksTable.userId, userId)))
          .returning()
          .then((res) => res[0]);
        if (updated) results.push(updated);
      }
      return results;
    });
  },
};