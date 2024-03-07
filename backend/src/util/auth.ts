import { sign, verify } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { NotAuthError } from './errors';
import { Request } from '../types/express.types';
import { NextFunction, Response } from 'express';
import admin from './firebaseAdmin';

const KEY = 'supersecret';

function createJSONToken(email: string) {
  return sign({ email }, KEY, { expiresIn: '1h' });
}

function validateJSONToken(token: string) {
  return verify(token, KEY);
}

function checkPassword(password: string, storedPassword: string) {
  return compare(password, storedPassword);
}

function checkAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    console.log('NOT AUTH. AUTH HEADER MISSING.');
    return next(new NotAuthError('Not authenticated.'));
  }
  const authFragments = req.headers.authorization.split(' ');

  if (authFragments.length !== 2) {
    console.log('NOT AUTH. AUTH HEADER INVALID.');
    return next(new NotAuthError('Not authenticated.'));
  }
  const authToken = authFragments[1];
  admin.auth().verifyIdToken(authToken)
    .then((decodedToken) => {
      req.token = decodedToken;
      next();
    })
    .catch((error) => {
      console.log('NOT AUTH. TOKEN INVALID.');
      return next(new NotAuthError('Not authenticated.'));
    });
}

export { createJSONToken, validateJSONToken, checkPassword, checkAuthMiddleware as checkAuth };
