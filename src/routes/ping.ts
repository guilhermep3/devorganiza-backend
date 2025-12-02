import { Router, type Response } from "express";
import { verifyJWT } from "../middlewares/jwt.js";
import type { ExtendedRequest } from "../types/request.js";

export const pingRoutes = Router();

pingRoutes.get('/ping', (req, res) => {
  res.json({ pong: true });
});

pingRoutes.get('/privateping', verifyJWT, (req: ExtendedRequest, res: Response) => {
  res.json({ pong: true, private: true, role: req.userRole });
});