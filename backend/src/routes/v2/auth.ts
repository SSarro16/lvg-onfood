import express from "express";
import admin from "../../util/firebaseAdmin";
import type { Request } from "../../types/express.types";
import { checkAuthV2 as checkAuth } from "../../util/auth";

const router = express.Router();

router.use(checkAuth);

// Logout - POST /logout
router.post("/logout", async (req: Request, res, next) => {
  // if token is valid
  if (req.token) {
    // logic to call signout on firebase ...
    try {
      await admin.auth().revokeRefreshTokens(req.token.uid);
      res.json({ success: true });
    } catch (error: any) {
      next({ message: error.message || "Error while logging out" });
    }
  } else {
    next({ message: "Error while logging out" });
  }
});

export default router;
