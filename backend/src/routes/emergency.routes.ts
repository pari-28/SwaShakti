import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createEmergencySchema,
  updateEmergencySchema,
} from "../validators/emergency.validator";

import {
  createEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
  setPrimaryContact,
} from "../controllers/emergency.controller";

import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createEmergencySchema),
  asyncHandler(createEmergencyContact)
);

router.get(
  "/",
  authenticate,
  asyncHandler(getEmergencyContacts)
);

router.put(
  "/:id",
  authenticate,
  validate(updateEmergencySchema),
  asyncHandler(updateEmergencyContact)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(deleteEmergencyContact)
);

router.patch(
  "/:id/primary",
  authenticate,
  asyncHandler(setPrimaryContact)
);

export default router;