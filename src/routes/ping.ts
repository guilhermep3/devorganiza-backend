import { Router, type Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import passport from "passport";

export const pingRoutes = Router();

pingRoutes.get('/ping', (req, res) => {
  res.json({ pong: true });
});

pingRoutes.get('/privateping',
  passport.authenticate('jwt', { session: false }),
  (req: ExtendedRequest, res: Response) => {
    res.json({ pong: true, private: true, role: req.userRole });
  }
);