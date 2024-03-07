import express from "express";
import admin from "../util/firebaseAdmin";
import type { Request } from "../types/express.types";
import { isValidEmail, isValidText } from "../util/validation";
import { checkAuth } from "../util/auth";


const router = express.Router();

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
  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(user.uid);
    res.json({ token });
  }
  catch (error: any) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJpYXQiOjE1MTYyMzkwMjJ9.5vB9JQ5';
  // res.json({ token });
});

router.use(checkAuth);

// Logout - POST /logout 
router.post("/logout", async(req: Request, res, next) => {
  // if token is valid
  if (req.token) {
    // logic to call signout on firebase ...
    try {
      await admin.auth().revokeRefreshTokens(req.token.uid);
      res.json({success: true})
    } catch (error: any) {
      next({message: 'Error while logging out'})
    }
    res.json({success: true})
  } else {
    next({message: 'Error while logging out'})
  }
});

export default router;