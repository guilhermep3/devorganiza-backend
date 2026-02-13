import { Router } from 'express';
import * as authController from "../controllers/auth.js";
import { signinSchema, signupSchema } from '../schemas/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';

export const authRoutes = Router();

authRoutes.post('/signup', validateSchema(signupSchema), authController.signup);
authRoutes.post('/signin', validateSchema(signinSchema), authController.signin);
