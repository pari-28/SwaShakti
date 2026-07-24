import { Router } from "express";
import {
  register,
  login,
  saveFcmToken,
  getCurrentUser,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Auth Router Working" });
});

router.post("/register", register);
router.post("/login", login);
router.post("/fcm-token", authenticate, saveFcmToken);

router.get("/me", authenticate, getCurrentUser);

export default router;