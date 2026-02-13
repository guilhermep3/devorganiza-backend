import { and, asc, eq } from "drizzle-orm"
import { studiesTable, tasksTable } from "../db/schema"
import { db } from "../lib/drizzle"

export const studyRepository = {
  async findAll(userId: string, perPage: number, currentPage: number) {
    return await db.select().from(studiesTable)
      .where(eq(studiesTable.userId, userId))
      .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId))
      .limit(perPage)
      .offset(currentPage * perPage)
  },

  async findStudies(userId: string) {
    return await db.select().from(studiesTable)
      .where(eq(studiesTable.userId, userId))
      .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId))
      .orderBy(asc(studiesTable.createdAt))
  },

  async findById(id: string) {
    return await db.select().from(studiesTable)
      .where(eq(studiesTable.id, id))
      .leftJoin(tasksTable, eq(tasksTable.studyId, studiesTable.id))
      .orderBy(asc(studiesTable.createdAt), asc(tasksTable.createdAt))
  },

  async findByName(name: string, userId: string) {
    return await db.select().from(studiesTable)
      .where(and(
        eq(studiesTable.name, name),
        eq(studiesTable.userId, userId)
      ))
      .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId));
  },

  async create(data: any) {
    return await db.insert(studiesTable).values(data).returning();
  },

  async update(studyId: string, userId: string, data: Partial<any>) {
    return await db.update(studiesTable)
      .set(data)
      .where(and(
        eq(studiesTable.id, studyId),
        eq(studiesTable.userId, userId)
      ))
      .returning();
  },

  async updateStudyProgress(dataUpdated: Record<string, any>, id: string) {
    return await db.update(studiesTable)
      .set(dataUpdated)
      .where(eq(studiesTable.id, id))
      .returning();
  },

  async delete(studyId: string, userId: string) {
    return await db.delete(studiesTable)
      .where(and(
        eq(studiesTable.id, studyId),
        eq(studiesTable.userId, userId)
      ));
  }
}