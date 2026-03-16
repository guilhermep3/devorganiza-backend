import { Router } from "express";
import * as taskController from "../controllers/task.js"
import { validateSchema } from "../middlewares/validateSchema.js";
import { createTaskSchema } from "../schemas/task.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const tasksRoutes = Router();

tasksRoutes.post('/:studyId', verifyJWT, validateSchema(createTaskSchema), taskController.createTask);
tasksRoutes.put('/:taskId', verifyJWT, taskController.updateTask);
tasksRoutes.delete('/:taskId', verifyJWT, taskController.deleteTask);
