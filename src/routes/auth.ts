import { Router } from 'express';
import * as authController from "../controllers/auth.js";
import { signinSchema, signupSchema } from '../schemas/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import passport from 'passport';

export const authRoutes = Router();

authRoutes.post('/signup', validateSchema(signupSchema), authController.signup);

authRoutes.post('/signin', validateSchema(signinSchema),
  passport.authenticate('local', { session: false }), authController.signin
);

authRoutes.get('/google',
  passport.authenticate("google", {
    scope: ["profile", "email"], session: false
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, failureRedirect: "/google/failure"
  }),
  authController.googleAuthCallback
);