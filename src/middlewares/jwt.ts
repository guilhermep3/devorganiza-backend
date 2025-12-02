import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { ExtendedRequest } from "../types/request.js";

export const createJWT = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string)
}

export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).json(
      { error: 'Acesso negado', errorDetails: 'Não possui o header de autorização' }
    );
    return;
  }

  const token = authorization.split(' ')[1];

  jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
    (error, decoded: any) => {
      if (error) {
        res.status(401).json({ error: 'Acesso negado', errorDetails: error });
        return;
      }
      req.idLogged = decoded.id;
      req.userRole = decoded.role;
      next();
    }
  )
}