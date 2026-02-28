import { desc, eq } from "drizzle-orm"
import { studiesTable, tasksTable, usersTable } from "../db/schema.js"
import { db } from "../lib/drizzle.js"
import { UpdateUserType, UserInsert } from "../schemas/auth.js"

export const userRepository = {
  async findAll(perPage: number, currentPage: number) {
    return await db.select().from(usersTable)
      .limit(perPage).offset(currentPage * perPage)
      .orderBy(desc(usersTable.createdAt))
  },

  async findById(id: string) {
    return await db.select().from(usersTable)
      .where(eq(usersTable.id, id)).limit(1)
      .then(res => res[0])
  },

  async findByEmail(email: string) {
    return await db.select().from(usersTable)
      .where(eq(usersTable.email, email)).limit(1)
      .then(res => res[0])
  },

  async findByUsername(username: string) {
    return await db.select().from(usersTable)
      .where(eq(usersTable.username, username)).limit(1)
      .then(res => res[0])
  },

  async findByGoogleId(googleId: string) {
    return await db.select().from(usersTable)
      .where(eq(usersTable.googleId, googleId)).limit(1)
      .then(res => res[0])
  },

  async linkGoogleAccount(userId: string, googleId: string) {
    return await db.update(usersTable).set({ googleId })
      .where(eq(usersTable.id, userId))
  },

  async create(data: UserInsert) {
    return await db.insert(usersTable).values(data).returning()
  },

  async getStudiesCount(id: string) {
    return await db.select().from(studiesTable)
      .where(eq(studiesTable.userId, id)).then(res => res.length)
  },

  async getTasksCount(id: string) {
    return await db.select().from(tasksTable)
      .leftJoin(studiesTable, eq(studiesTable.id, tasksTable.studyId))
      .where(eq(studiesTable.userId, id)).then(res => res.length)
  },

  async getStudiesPercentage(id: string) {
    return await db.select().from(studiesTable)
      .where(eq(studiesTable.userId, id))
  },

  async findStudies(id: string) {
    return await db.select().from(studiesTable)
      .where(eq(studiesTable.userId, id))
  },

  async updateById(id: string, data: UpdateUserType) {
    return await db.update(usersTable).set(data)
      .where(eq(usersTable.id, id))
  },

  async deleteById(id: string) {
    return await db.delete(usersTable).where(eq(usersTable.id, id))
  },

  async updateImage(id: string, imageUrl: string) {
    return await db.update(usersTable).set({ profileImage: imageUrl })
      .where(eq(usersTable.id, id))
  }
}