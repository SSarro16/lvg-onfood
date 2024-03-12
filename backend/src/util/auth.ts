import { sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { NotAuthError } from "./errors";
import { Request } from "../types/express.types";
import { NextFunction, Response } from "express";
import admin from "./firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const KEY = "supersecret";

function createJSONToken(email: string) {
  return sign({ email }, KEY, { expiresIn: "1h" });
}

function validateJSONToken(token: string) {
  return verify(token, KEY);
}

function checkPassword(password: string, storedPassword: string) {
  return compare(password, storedPassword);
}

// OLD CHECKAUTH TO BE REMOVED
function checkAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING.");
    return next(new NotAuthError("Not authenticated."));
  }
  const authFragments = req.headers.authorization.split(" ");

  if (authFragments.length !== 2) {
    console.log("NOT AUTH. AUTH HEADER INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  const authToken = authFragments[1];
  console.log(authToken);
  if (authToken) {
    req.token = authToken as unknown as DecodedIdToken;
    return next();
  }
}

// NEW CHECKAUTH
function checkAuthMiddleware1(req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.headers.authorization) {
    console.log("NOT AUTH. AUTH HEADER MISSING.");
    return next(new NotAuthError("Not authenticated."));
  }
  const authFragments = req.headers.authorization.split(" ");

  if (authFragments.length !== 2) {
    console.log("NOT AUTH. AUTH HEADER INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  const authToken = authFragments[1];
  admin
    .auth()
    .verifyIdToken(authToken)
    .then((decodedToken) => {
      req.token = decodedToken;
      console.log('authtoken', decodedToken)
      next();
    })
    .catch((error: any) => {
      console.log(`NOT AUTH. TOKEN INVALID. ${error.message || ""}`);
      return next(new NotAuthError("Not authenticated"));
    });
}

export {
  createJSONToken,
  validateJSONToken,
  checkPassword,
  checkAuthMiddleware as checkAuth,
  checkAuthMiddleware1 as checkAuthNew,
};
