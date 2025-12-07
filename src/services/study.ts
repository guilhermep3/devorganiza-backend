import { and, asc, eq } from "drizzle-orm"
import { studiesTable, tasksTable } from "../db/schema.js"
import { db } from "../lib/drizzle.js"
import { StudyInsert } from "../schemas/study.js"

export const findAllStudies = async (userId: number, perPage: number, currentPage: number) => {
  const rows = await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, userId))
    .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId))
    .limit(perPage)
    .offset(currentPage * perPage)

  const map = new Map<number, any>();

  for (const row of rows) {
    const study = row.studies;
    const task = row.tasks;

    if (!map.has(study.id)) {
      map.set(study.id, {
        study,
        tasks: []
      });
    }

    if (task) {
      map.get(study.id).tasks.push(task);
    }
  }

  return Array.from(map.values());
};

export const findUserStudies = async (userId: number) => {
  return await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, userId))
    .leftJoin(tasksTable, eq(studiesTable.id, tasksTable.studyId))
    .orderBy(asc(studiesTable.createdAt))
}

export const findUserStudyById = async (id: number) => {
  const rows = await db.select().from(studiesTable)
    .where(eq(studiesTable.id, id))
    .leftJoin(tasksTable, eq(tasksTable.studyId, studiesTable.id))

  if (!rows.length) return null;

  const study = rows[0]?.studies;
  const tasks = rows
    .map(r => r.tasks)
    .filter(t => t !== null);

  return {
    study, tasks
  };
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