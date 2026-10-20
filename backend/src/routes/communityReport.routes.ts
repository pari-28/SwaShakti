import { Router } from "express";

import CommunityReportController from "../controllers/communityReport.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCommunityReportSchema } from "../validators/communityReport.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  validate(createCommunityReportSchema),
  CommunityReportController.create
);

router.get(
  "/my",
  authenticate,
  CommunityReportController.getMine
);

export default router;