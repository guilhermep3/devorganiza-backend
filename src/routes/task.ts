import { Router } from "express";
import * as taskController from "../controllers/task.js"
import { validateSchema } from "../middlewares/validateSchema.js";
import { createTaskSchema } from "../schemas/task.js";
import passport from "passport";

export const taskRoutes = Router();

taskRoutes.post('/:studyId',
  passport.authenticate('jwt', { session: false }),
  validateSchema(createTaskSchema), taskController.createTask
);

taskRoutes.put('/:taskId',
  passport.authenticate('jwt', { session: false }),
  taskController.updateTask
);

taskRoutes.delete('/:taskId',
  passport.authenticate('jwt', { session: false }),
  taskController.deleteTask
);
