import type { Request } from "express";

export type ExtendedRequest = Request & {
  idLogged?: string;
  userRole?: string;
}