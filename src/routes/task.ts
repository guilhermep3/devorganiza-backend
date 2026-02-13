import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import * as taskController from "../controllers/task.js"
import { validateSchema } from "../middlewares/validateSchema.js";
import { createTaskSchema } from "../schemas/task.js";

export const taskRoutes = Router();

taskRoutes.post('/:studyId', verifyJWT, validateSchema(createTaskSchema), taskController.createTask);
taskRoutes.put('/:taskId', verifyJWT, taskController.updateTask);
taskRoutes.delete('/:taskId', verifyJWT, taskController.deleteTask);