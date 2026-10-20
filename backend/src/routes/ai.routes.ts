import { Router } from "express";
import {
  generateAreaRiskAnalysisController,
  safetyAssistantController,
} from "../controllers/ai.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/risk",
  asyncHandler(generateAreaRiskAnalysisController)
);

router.post(
  "/assistant",
  asyncHandler(safetyAssistantController)
);

export default router;