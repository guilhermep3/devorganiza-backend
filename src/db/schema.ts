import { boolean, integer, pgEnum, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  profileImage: varchar({ length: 255 }),
  role: varchar({ length: 50 }).default('user').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
})

export const studiesTable = pgTable("studies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 255 }),
  link: varchar({ length: 500 }),
  description: varchar({ length: 1000 }),
  status: varchar({ length: 50 }).default("em_andamento").notNull(),
  progress: integer().default(0).notNull(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const tasksTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 500 }),
  done: boolean().default(false).notNull(),
  studyId: integer().notNull().references(() => studiesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  finishIn: timestamp(),
  finishedAt: timestamp(),
});

export const quizzesTable = pgTable("quizzes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 1000 }),
  imageUrl: varchar({ length: 500 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const questionsTable = pgTable("questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  question: varchar({ length: 1000 }).notNull(),
  quizId: integer().notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const alternativesTable = pgTable("alternatives", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: varchar({ length: 1000 }).notNull(),
  isCorrect: boolean().default(false).notNull(),
  questionId: integer().notNull().references(() => questionsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const userQuizzesTable = pgTable("user_quizzes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: integer().notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  unlockedAt: timestamp().defaultNow().notNull(),
}, (table) => {
  return {
    uniqueUserQuiz: uniqueIndex("user_quiz_unique").on(table.userId, table.quizId),
  };
});

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: integer().notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  startedAt: timestamp().defaultNow().notNull(),
  finishedAt: timestamp(),
  score: integer(),
  durationSec: integer(),
});
