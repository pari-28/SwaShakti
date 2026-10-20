import { Router } from "express";

import {
  getCityRiskController,
  getCityRiskByNameController,
  getCommunityAreaRiskController,
  getCommunityAreaRiskByLocationController,
} from "../controllers/risk.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/cities",
  asyncHandler(getCityRiskController)
);

router.get(
  "/cities/:city",
  asyncHandler(getCityRiskByNameController)
);

router.get(
  "/areas",
  asyncHandler(getCommunityAreaRiskController)
);

router.get(
  "/areas/:location",
  asyncHandler(getCommunityAreaRiskByLocationController)
);

export default router;