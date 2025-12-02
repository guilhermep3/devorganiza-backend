import type { Request } from "express";

export type ExtendedRequest = Request & {
  idLogged?: number;
  userRole?: string;
}