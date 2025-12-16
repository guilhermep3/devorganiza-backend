import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as chartController from "../controllers/chart"
export const chartRoutes = Router();

chartRoutes.get('/weekly-productivity', verifyJWT, chartController.getWeeklyProductivity);
chartRoutes.get('/tasks-by-type', verifyJWT, chartController.getTasksByType);
chartRoutes.get('/finished-tasks-by-month', verifyJWT, chartController.getFinishedTasksByMonth);
chartRoutes.get('/average-score', verifyJWT, chartController.getAverageScore);
chartRoutes.get('/faster-attempts', verifyJWT, chartController.getFasterAttempts);