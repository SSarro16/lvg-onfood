import express, { NextFunction, Request, Response } from "express";
import {createJSONToken} from "../util/auth";


const router = express.Router();

// Login and get token - POST /login BODY {username, password}

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
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

  const token = createJSONToken(email);
  res.json({ token });
});

// Logout - POST /logout BODY {token}
router.post("/logout", async(req, res, next) => {
  // logic to call signout on firebase ...

  // if all good
  if (true) {
    res.json({success: true})
  } else {
    next({error: 'Error while logging out'})
  }
});

export default router;