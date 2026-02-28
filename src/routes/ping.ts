import { Router, type Response } from "express";
import type { ExtendedRequest } from "../types/request.js";
import { verifyJWT } from "../middlewares/verifyJwt.js";

export const pingRoutes = Router();

pingRoutes.get('/ping', (req, res) => {
  res.json({ pong: true });
});

pingRoutes.get('/privateping', verifyJWT,
  (req: ExtendedRequest, res: Response) => {
    res.json({ pong: true, private: true, role: req.userRole });
  }
);