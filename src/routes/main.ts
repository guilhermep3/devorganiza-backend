import { Router } from 'express';
import { authRoutes } from './auth.js';
import { usersRoutes } from './user.js';
import { studiesRoutes } from './study.js';
import { tasksRoutes } from './task.js';
import { quizzesRoutes } from './quiz.js';
import { pingRoutes } from './ping.js';
import { chartsRoutes } from './chart.js';
import { db } from '../lib/drizzle.js';
import { usersTable } from '../db/schema.js';
import { notesRoutes } from './notes.js';

const mainRouter = Router();

mainRouter.get("/", (_, res) => {
  res.status(200).json({ status: "ok" });
});

mainRouter.get("/health", async (_, res) => {
  await db.select().from(usersTable).limit(1);
  res.status(200).json({ status: "ok" });
});

mainRouter.use(pingRoutes);
mainRouter.use("/auth", authRoutes);
mainRouter.use("/users", usersRoutes);
mainRouter.use("/studies", studiesRoutes);
mainRouter.use("/tasks", tasksRoutes);
mainRouter.use("/quizzes", quizzesRoutes);
mainRouter.use("/charts", chartsRoutes);
mainRouter.use("/notes", notesRoutes)

export default mainRouter;