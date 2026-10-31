import { Router } from "express";

import {
  generateAreaRiskAnalysisController,
  safetyAssistantController,
} from "../controllers/ai.controller.js";

const router = Router();

router.post("/risk", generateAreaRiskAnalysisController);

router.post("/assistant", safetyAssistantController);

export default router;