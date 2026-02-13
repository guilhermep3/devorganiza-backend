import { db } from "../lib/drizzle.js";
import { tasksTable } from "../db/schema.js";
import { eq, and, isNotNull } from "drizzle-orm";
import { TaskInsert } from "../schemas/task.js";

export const taskRepository = {
  async findById(taskId: string) {
    const result = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId));

    return result[0];
  },

  async create(data: TaskInsert) {
    const result = await db
      .insert(tasksTable)
      .values(data)
      .returning();

    return result[0];
  },

  async update(taskId: string, data: Partial<TaskInsert>) {
    const result = await db
      .update(tasksTable)
      .set(data)
      .where(eq(tasksTable.id, taskId))
      .returning();

    return result[0];
  },

  async delete(taskId: string) {
    return db
      .delete(tasksTable)
      .where(eq(tasksTable.id, taskId));
  },

  async countByStudyId(studyId: string) {
    const tasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.studyId, studyId));

    return tasks.length;
  },

  async countFinishedByStudyId(studyId: string) {
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
  }
};
