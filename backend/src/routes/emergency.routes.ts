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

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createEmergencySchema),
  createEmergencyContact
);
router.get("/", authenticate, getEmergencyContacts);
router.put(
  "/:id",
  authenticate,
  validate(updateEmergencySchema),
  updateEmergencyContact
);
router.delete("/:id", authenticate, deleteEmergencyContact);

router.patch(
  "/:id/primary",
  authenticate,
  setPrimaryContact
);

export default router;