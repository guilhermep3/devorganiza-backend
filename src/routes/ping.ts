import { Router, type Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import passport from "passport";

export const pingRoutes = Router();

pingRoutes.get('/ping', (req, res) => {
  res.json({ pong: true });
});

pingRoutes.get('/privateping',
  passport.authenticate('jwt', { session: false }),
  (req, res: Response) => {
    const extendedReq = req as ExtendedRequest;
    res.json({ pong: true, private: true, role: extendedReq.user?.role });
  }
);