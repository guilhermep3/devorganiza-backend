import { and, asc, eq } from "drizzle-orm"
import { studiesTable, tasksTable } from "../db/schema.js"
import { db } from "../lib/drizzle.js"
import { StudyInsert } from "../schemas/study.js"

export const findAllStudies = async (userId: number, perPage: number, currentPage: number) => {
  return await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, userId))
    .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId))
    .limit(perPage)
    .offset(currentPage * perPage)
}

export const findUserStudies = async (userId: number) => {
  return await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, userId))
    .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId))
    .orderBy(asc(studiesTable.createdAt))
}

export const findUserStudyByName = async (name: string, userId: number) => {
  return await db.select().from(studiesTable)
    .where(and(
      eq(studiesTable.name, name),
      eq(studiesTable.userId, userId)
    ))
    .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId));
};

export const createUserStudy = async (data: StudyInsert) => {
  return await db.insert(studiesTable).values(data).returning();
}

export const updateStudyById = async (
  studyId: number, userId: number, data: Partial<StudyInsert>
) => {
  const updatedStudy = await db.update(studiesTable)
    .set(data)
    .where(and(
      eq(studiesTable.id, studyId),
      eq(studiesTable.userId, userId)
    ))
    .returning();

  return updatedStudy;
};

export const updateStudyProgress = async (id: number, progress: number) => {
  return await db.update(studiesTable)
    .set({ progress })
    .where(eq(studiesTable.id, id))
    .returning();
}

export const deleteStudyById = async (studyId: number, userId: number) => {
  return await db.delete(studiesTable)
    .where(and(
      eq(studiesTable.id, studyId),
      eq(studiesTable.userId, userId)
    ));
};