import { eq, and, isNotNull, asc } from "drizzle-orm";
import { tasksTable } from "../db/schema.js";
import { db } from "../lib/drizzle.js";
import { TaskInsert } from "../schemas/task.js";

export const findTaskById = async (taskId: string) => {
  return await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, taskId))
    .then(res => res[0]);
}

export const createUserTask = async (data: TaskInsert) => {
  return await db
    .insert(tasksTable)
    .values(data)
    .returning()
    .then(res => res[0]);
};

export const updateUserTask = async (taskId: string, data: TaskInsert) => {
  return await db
    .update(tasksTable)
    .set(data)
    .where(eq(tasksTable.id, taskId))
    .returning()
    .then(res => res[0]);
};

export const findTasksCount = async (studyId: string) => {
  const tasks = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.studyId, studyId));

  return tasks.length;
};

export const findFinishedTasksCount = async (studyId: string) => {
  const tasks = await db
    .select()
    .from(tasksTable)
    .where(
      and(
        eq(tasksTable.studyId, studyId),
        isNotNull(tasksTable.finishedAt)
      )
    );

  return tasks.length;
};

export const deleteUserTask = async (taskId: string) => {
  return await db
    .delete(tasksTable)
    .where(eq(tasksTable.id, taskId));
};
