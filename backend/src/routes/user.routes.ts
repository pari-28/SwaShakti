import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import type { AuthRequest } from "../middleware/auth.middleware";


const router = Router();

router.get("/profile", authenticate, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully!",
    userId: req.userId,
  });
});

export default router;