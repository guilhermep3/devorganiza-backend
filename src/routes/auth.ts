import { Router } from 'express';
import * as authController from "../controllers/auth.js";
import { signinSchema, signupSchema } from '../schemas/auth.js';
import { validadeSchema } from '../middlewares/validateSchema.js';

export const authRoutes = Router();

authRoutes.post('/signup', validadeSchema(signupSchema), authController.signup);
authRoutes.post('/signin', validadeSchema(signinSchema), authController.signin);
