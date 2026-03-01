import { Router } from 'express';
import * as authController from "../controllers/auth.js";
import { signinSchema, signupSchema } from '../schemas/auth.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import passport from 'passport';
import { verifyJWT } from '../middlewares/verifyJwt.js';
import { ExtendedRequest } from '../types/request.js';

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

authRoutes.get("/me", verifyJWT, (req: ExtendedRequest, res) => {
  res.json({
    id: req.idLogged,
    role: req.userRole
  });
});