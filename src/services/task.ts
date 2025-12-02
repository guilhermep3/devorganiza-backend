import { eq, and, isNotNull, asc } from "drizzle-orm";
import { tasksTable } from "../db/schema";
import { db } from "../lib/drizzle";
import { TaskInsert } from "../schemas/task";

export const findUserTasks = async (studyId: number) => {
  return await db.select()
    .from(tasksTable)
    .where(eq(tasksTable.studyId, studyId))
    .orderBy(asc(tasksTable.id));
};

export const createUserTask = async (data: TaskInsert) => {
  return await db.insert(tasksTable)
    .values(data)
    .returning();
};

export const updateUserTask = async (taskId: number, data: TaskInsert) => {
  return await db.update(tasksTable)
    .set(data)
    .where(eq(tasksTable.id, taskId))
    .returning();
};

export const findTasksCount = async (studyId: number) => {
  const tasks = await db.select()
    .from(tasksTable)
    .where(eq(tasksTable.studyId, studyId));

  return tasks.length;
};

export const findFinishedTasksCount = async (studyId: number) => {
  const tasks = await db.select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.studyId, studyId),
        isNotNull(tasksTable.finishedAt)
      )
    );

  return tasks.length;
};

export const deleteUserTask = async (taskId: number) => {
  return await db.delete(tasksTable)
    .where(eq(tasksTable.id, taskId));
};
