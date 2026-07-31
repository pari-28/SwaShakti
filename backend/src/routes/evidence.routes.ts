import { Router } from "express";
import EvidenceController from "../controllers/evidence.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  EvidenceController.uploadEvidence
);

router.get(
  "/:sosId",
  authenticate,
  EvidenceController.getEvidence
);

export default router;