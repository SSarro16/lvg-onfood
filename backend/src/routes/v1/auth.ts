import express from "express";
import { isValidEmail } from "../../util/validation";
import { checkAuth } from "../../util/auth";
import { Request } from "../../types/express.types";


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

router.use(checkAuth);

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

export default router;