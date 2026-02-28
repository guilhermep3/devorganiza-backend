import { Router } from "express";
import * as chartController from "../controllers/chart.js"
import passport from "passport";
export const chartRoutes = Router();

chartRoutes.get('/weekly-productivity',
  passport.authenticate('jwt', { session: false }), chartController.getWeeklyProductivity
);

chartRoutes.get('/tasks-by-type',
  passport.authenticate('jwt', { session: false }), chartController.getTasksByType
);

chartRoutes.get('/finished-tasks-by-month',
  passport.authenticate('jwt', { session: false }), chartController.getFinishedTasksByMonth
);

chartRoutes.get('/average-time-finish-task',
  passport.authenticate('jwt', { session: false }), chartController.getAverageTimeFinishTask
);

chartRoutes.get('/average-score',
  passport.authenticate('jwt', { session: false }), chartController.getAverageScore
);

chartRoutes.get('/faster-attempts',
  passport.authenticate('jwt', { session: false }), chartController.getFasterAttempts
);
