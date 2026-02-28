import type { Request } from "express";
import { UserInsert } from "../schemas/auth";

export type ExtendedRequest = Request & {
  // idLogged?: string;
  // userRole?: string;
  user?: UserInsert;
}