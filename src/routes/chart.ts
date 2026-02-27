import { Router } from "express";
import * as chartController from "../controllers/chart.js"
import { verifyJWT } from "../others/oldVerifyJWT.js";
export const chartRoutes = Router();

chartRoutes.get('/weekly-productivity', verifyJWT, chartController.getWeeklyProductivity);
chartRoutes.get('/tasks-by-type', verifyJWT, chartController.getTasksByType);
chartRoutes.get('/finished-tasks-by-month', verifyJWT, chartController.getFinishedTasksByMonth);
chartRoutes.get('/average-time-finish-task', verifyJWT, chartController.getAverageTimeFinishTask);
chartRoutes.get('/average-score', verifyJWT, chartController.getAverageScore);
chartRoutes.get('/faster-attempts', verifyJWT, chartController.getFasterAttempts);