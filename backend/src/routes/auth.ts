import express from "express";
import type { Request } from "../types/express.types";
import { isValidEmail, isValidText } from "../util/validation";


const router = express.Router();

// Login and get token - POST /login BODY {username, password}

router.post("/login", async (req: Request, res) => {
  let email = req.body.email;
  let password = req.body.password;
  // validation & sanitization
  if (!isValidEmail(email) || !isValidText(password, 8)) {
    return res.status(422).json({ message: 'Invalid email or password.' });
  } 
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email) || email.length === 0 || email.length > 255) {
    return res.status(422).json({ message: 'Invalid email format.' });
  }
  if (password.length > 255) {
    return res.status(422).json({ message: 'Password too long.' });
  }
  email = email.trim();
  password = password.trim();

  console.log({email, password})

  // let user;
  // try {
  //   user = await get(email);
  // } catch (error) {
  //   return res.status(401).json({ message: 'Authentication failed.' });
  // }

  // const pwIsValid = await isValidPassword(password, user.password);
  // if (!pwIsValid) {
  //   return res.status(422).json({
  //     message: 'Invalid credentials.',
  //     errors: { credentials: 'Invalid email or password entered.' },
  //   });
  // }

  // json example token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlcm5hbWUiLCJpYXQiOjE1MTYyMzkwMjJ9.5vB9JQ5';
  res.json({ token });
});

// Logout - POST /logout 
router.post("/logout", async(req: Request, res, next) => {
  // if token is valid
  if (req.token) {
    // logic to call signout on firebase ...

    res.json({success: true})
  } else {
    next({message: 'Error while logging out'})
  }
});

export default router;