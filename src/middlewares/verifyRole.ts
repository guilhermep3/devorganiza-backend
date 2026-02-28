import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "../types/request.js";

export const verifyRole = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const role = req.userRole;
  const allowedRoles = ["admin", "dev"];

  if (!role || !allowedRoles.includes(role)) {
    res.status(403).json({ error: "Acesso negado, permissão insuficiente" });
    return;
  }
  next();
}