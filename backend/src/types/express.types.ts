import { Request as ExpressRequest } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { JwtPayload } from "jsonwebtoken";

interface Request extends ExpressRequest {
  token?: DecodedIdToken;
}

export {Request}