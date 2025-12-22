import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as taskController from "../controllers/task.js"

export const taskRoutes = Router();

taskRoutes.post('/:studyId', verifyJWT, taskController.createTask);
taskRoutes.put('/:taskId', verifyJWT, taskController.updateTask);
taskRoutes.delete('/:taskId', verifyJWT, taskController.deleteTask);