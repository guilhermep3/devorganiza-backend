import { Router } from "express";
import * as chartController from "../controllers/chart.js"
import { verifyJWT } from "../middlewares/verifyJwt.js";
export const chartsRoutes = Router();

chartsRoutes.get('/weekly-productivity',
  verifyJWT, chartController.getWeeklyProductivity
);

chartsRoutes.get('/tasks-by-type',
  verifyJWT, chartController.getTasksByType
);

chartsRoutes.get('/finished-tasks-by-month',
  verifyJWT, chartController.getFinishedTasksByMonth
);

chartsRoutes.get('/average-time-finish-task',
  verifyJWT, chartController.getAverageTimeFinishTask
);

chartsRoutes.get('/average-score',
  verifyJWT, chartController.getAverageScore
);

chartsRoutes.get('/faster-attempts',
  verifyJWT, chartController.getFasterAttempts
);
