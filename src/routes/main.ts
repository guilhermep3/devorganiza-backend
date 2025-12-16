import { Router } from 'express';
import { authRoutes } from './auth.js';
import { userRoutes } from './user.js';
import { studiesRoutes } from './study.js';
import { taskRoutes } from './task.js';
import { quizRoutes } from './quiz.js';
import { pingRoutes } from './ping.js';
import { chartRoutes } from './chart.js';

const mainRouter = Router();

mainRouter.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});
mainRouter.use(pingRoutes);
mainRouter.use('/auth', authRoutes);
mainRouter.use('/users', userRoutes);
mainRouter.use('/studies', studiesRoutes);
mainRouter.use('/tasks', taskRoutes);
mainRouter.use('/quizzes', quizRoutes);
mainRouter.use('/charts', chartRoutes);

export default mainRouter;