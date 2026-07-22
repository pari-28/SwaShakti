import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Auth Router Working" });
});

router.post("/register", register);
router.post("/login", login);

export default router;