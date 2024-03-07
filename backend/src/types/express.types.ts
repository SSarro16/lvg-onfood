import { Request as ExpressRequest } from "express";
import { JwtPayload } from "jsonwebtoken";

interface Request extends ExpressRequest {
  token?: string | JwtPayload;
}

export {Request}