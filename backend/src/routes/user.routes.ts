import { Router } from "express";
import {
  authenticate,
  type AuthRequest,
} from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/profile",
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    return res.json({
      success: true,
      message: "Protected route accessed successfully!",
      userId: req.userId,
    });
  })
);

export default router;