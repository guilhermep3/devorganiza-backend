import { Router } from "express";
import * as taskController from "../controllers/task.js"
import { validateSchema } from "../middlewares/validateSchema.js";
import { createTaskSchema } from "../schemas/task.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const taskRoutes = Router();

taskRoutes.post('/:studyId', verifyJWT, validateSchema(createTaskSchema), taskController.createTask);
taskRoutes.put('/:taskId', verifyJWT, taskController.updateTask);
taskRoutes.delete('/:taskId', verifyJWT, taskController.deleteTask);
