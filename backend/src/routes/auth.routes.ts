import { Router } from "express";
import {
  register,
  login,
  saveFcmToken,
  getCurrentUser,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  registerSchema,
  loginSchema,
  fcmTokenSchema,
} from "../validators/auth.validator";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Auth Router Working" });
});

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post(
  "/fcm-token",
  authenticate,
  validate(fcmTokenSchema),
  saveFcmToken
);

router.get("/me", authenticate, getCurrentUser);

export default router;