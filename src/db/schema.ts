import { boolean, integer, pgEnum, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const studyStatusEnum = pgEnum("study_status", ["em_andamento", "finalizado",]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  profileImage: varchar({ length: 255 }),
  role: varchar({ length: 50 }).default("user").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const studiesTable = pgTable("studies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 255 }),
  link: varchar({ length: 500 }),
  description: varchar({ length: 1000 }),
  status: studyStatusEnum("status").default("em_andamento").notNull(),
  progress: integer().default(0).notNull(),
  userId: uuid("userId").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const tasksTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  link: varchar({ length: 500 }),
  done: boolean().default(false).notNull(),
  studyId: uuid("studyId").notNull().references(() => studiesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  finishIn: timestamp(),
  finishedAt: timestamp(),
});

export const quizzesTable = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 1000 }),
  type: varchar({ length: 255 }).notNull(),
  imageUrl: varchar({ length: 500 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: varchar({ length: 1000 }).notNull(),
  quizId: uuid("quizId").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const alternativesTable = pgTable("alternatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: varchar({ length: 1000 }).notNull(),
  isCorrect: boolean().default(false).notNull(),
  questionId: uuid("questionId").notNull().references(() => questionsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => new Date()),
});

export const userQuizzesTable = pgTable("user_quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: uuid("quizId").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  unlockedAt: timestamp().defaultNow().notNull(),
}, (table) => {
  return {
    uniqueUserQuiz: uniqueIndex("user_quiz_unique").on(table.userId, table.quizId),
  };
});

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: uuid("quizId").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  startedAt: timestamp().defaultNow().notNull(),
  finishedAt: timestamp(),
  score: integer(),
  durationSec: integer(),
});