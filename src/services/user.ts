import { desc, eq } from "drizzle-orm"
import { studiesTable, tasksTable, usersTable } from "../db/schema.js"
import { db } from "../lib/drizzle.js"
import { UpdateUserType } from "../schemas/auth.js"

export const findAllUsers = async (perPage: number, currentPage: number) => {
  return await db.select().from(usersTable)
    .limit(perPage).offset(currentPage * perPage)
    .orderBy(desc(usersTable.createdAt))
}

export const findUserById = async (id: string) => {
  return await db.select().from(usersTable)
    .where(eq(usersTable.id, id)).limit(1).then(res => res[0])
}

export const findUserByEmail = async (email: string) => {
  return await db.select().from(usersTable)
    .where(eq(usersTable.email, email)).limit(1).then(res => res[0])
}

export const findUserByUsername = async (username: string) => {
  return await db.select().from(usersTable)
    .where(eq(usersTable.username, username)).limit(1).then(res => res[0])
}

export const createUser = async (data: typeof usersTable.$inferInsert) => {
  return await db.insert(usersTable).values(data).returning()
}

export const getUserStudiesCount = async (id: string) => {
  return await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, id)).then(res => res.length)
}

export const getUserTasksCount = async (id: string) => {
  return await db.select().from(tasksTable)
    .leftJoin(studiesTable, eq(studiesTable.id, tasksTable.studyId))
    .where(eq(studiesTable.userId, id)).then(res => res.length)
}

export const getUserStudiesPercentage = async (id: string) => {
  const studies = await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, id))

  if (studies.length === 0) return 0
  const totalProgress = studies.reduce((acc, study) => acc + study.progress, 0)
  const percentage = totalProgress / studies.length

  return percentage
}

export const findUserStudies = async (id: string) => {
  return await db.select().from(studiesTable)
    .where(eq(studiesTable.userId, id))
}

export const updateUserById = async (id: string, data: UpdateUserType) => {
  return await db.update(usersTable).set(data)
    .where(eq(usersTable.id, id))
}

export const deleteUserById = async (id: string) => {
  return await db.delete(usersTable).where(eq(usersTable.id, id))
}

export const updateImageByUser = async (id: string, imageUrl: string) => {
  return await db.update(usersTable).set({ profileImage: imageUrl })
    .where(eq(usersTable.id, id))
}