import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "../types/request.js";

export const verifyRole = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const role = req.userRole;

  if (!role || role !== "admin") {
    res.status(403).json({ error: "Acesso negado, permissão insuficiente" });
    return;
  }
  next();
}