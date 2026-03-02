import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { ExtendedRequest } from "../types/request.js";

export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {

  const bearerToken = req.headers.authorization?.split(" ")[1];
  console.log("bearerToken", bearerToken);

  const cookieToken = req.cookies.token;
  console.log("cookieToken", cookieToken);

  const token = cookieToken || bearerToken;
  console.log("token", token);

  if (!token) {
    res.status(401).json(
      { error: 'Acesso negado', errorDetails: 'Não possui o token de autorização' }
    );
    return;
  }

  jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
    (error, decoded: any) => {
      if (error) {
        res.status(401).json({
          error: 'Token inválido',
          errorDetails: error
        });
        return;
      }

      req.idLogged = decoded.id;
      req.userRole = decoded.role;

      next();
    }
  )
}