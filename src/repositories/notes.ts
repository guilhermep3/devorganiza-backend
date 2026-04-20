import { and, asc, desc, eq } from "drizzle-orm";
import { boxesTable, notesTable } from "../db/schema.js";
import { db } from "../lib/drizzle.js";
import { CreateBoxType, CreateNoteType, UpdateBoxType, UpdateNoteType } from "../schemas/notes.js";

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

  // ---------- Boxes ----------

  async findBoxesByNote(notesId: string, userId: string) {
    return await db
      .select()
      .from(boxesTable)
      .where(and(eq(boxesTable.notesId, notesId), eq(boxesTable.userId, userId)))
      .orderBy(asc(boxesTable.position));
  },

  async findBoxById(id: string, userId: string) {
    return await db
      .select()
      .from(boxesTable)
      .where(and(eq(boxesTable.id, id), eq(boxesTable.userId, userId)))
      .limit(1)
      .then((res) => res[0]);
  },

  async createBox(notesId: string, userId: string, data: CreateBoxType) {
    return await db
      .insert(boxesTable)
      .values({ ...data, notesId, userId })
      .returning()
      .then((res) => res[0]);
  },

  async updateBox(id: string, userId: string, data: UpdateBoxType) {
    return await db
      .update(boxesTable)
      .set(data)
      .where(and(eq(boxesTable.id, id), eq(boxesTable.userId, userId)))
      .returning()
      .then((res) => res[0]);
  },

  async deleteBox(id: string, userId: string) {
    return await db
      .delete(boxesTable)
      .where(and(eq(boxesTable.id, id), eq(boxesTable.userId, userId)))
      .returning()
      .then((res) => res[0]);
  },

  async reorderBoxes(updates: { id: string; position: number }[], userId: string) {
    return await db.transaction(async (tx) => {
      const results = [];
      for (const { id, position } of updates) {
        const updated = await tx
          .update(boxesTable)
          .set({ position })
          .where(and(eq(boxesTable.id, id), eq(boxesTable.userId, userId)))
          .returning()
          .then((res) => res[0]);
        if (updated) results.push(updated);
      }
      return results;
    });
  },
};