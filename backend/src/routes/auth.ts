import express from "express";
import admin from "../util/firebaseAdmin";
import type { Request } from "../types/express.types";
import { isValidEmail, isValidText } from "../util/validation";
import { checkAuth, checkAuthNew } from "../util/auth";


const router = express.Router();

// [old - to be removed]
// Login and get token - POST /login BODY {username}
router.post("/login", async (req: Request, res) => {
  let email = req.body.email;
  // validation & sanitization
  if (!isValidEmail(email)) {
    return res.status(422).json({ message: 'Invalid email or password.' });
  } 
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email) || email.length === 0 || email.length > 255) {
    return res.status(422).json({ message: 'Invalid email format.' });
  }
  email = email.trim();

  console.log({email})
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJpYXQiOjE1MTYyMzkwMjJ9.5vB9JQ5';
  res.json({ token });
});

// [new]
// Login and get token - POST /login BODY {username}
router.post("/login-new", async (req: Request, res) => {
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJpYXQiOjE1MTYyMzkwMjJ9.5vB9JQ5';
  // res.json({ token });
  let email = req.body.email;
  // validation & sanitization
  if (!isValidEmail(email)) {
    return res.status(422).json({ message: 'Invalid email or password.' });
  } 
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email) || email.length === 0 || email.length > 255) {
    return res.status(422).json({ message: 'Invalid email format.' });
  }
  email = email.trim();

  console.log({email})
  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    res.json({ token });
  }
  catch (error: any) {
    console.log(error);
    return res.status(401).json({ message: error.message || 'Invalid email or password.' });
  }
});

router.use(checkAuthNew);

// [old - to be removed]
// Logout - POST /logout 
router.post("/logout", async(req: Request, res, next) => {
  // if token is valid
  if (req.token) {
    try {
      res.json({success: true})
    } catch (error: any) {
      next({message: error.message || 'Error while logging out'})
    }
  } else {
    next({message: 'Error while logging out'})
  }
});

// [new]
// Logout - POST /logout 
router.post("/logout-new", async(req: Request, res, next) => {
  // if token is valid
  console.log('REQ TOKEN= ', req.token)
  if (req.token) {
    // logic to call signout on firebase ...
    console.log('LOGOUT BACKEND TOKEN IS: ',  req.token)
    try {
      await admin.auth().revokeRefreshTokens(req.token.uid);
      res.json({success: true})
    } catch (error: any) {
      next({message: error.message || 'Error while logging out'})
    }
  } else {
    next({message: 'Error while logging out'})
  }
});

export default router;