import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
  createEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../controllers/emergency.controller";

const router = Router();

router.post("/", authenticate, createEmergencyContact);
router.get("/", authenticate, getEmergencyContacts);
router.put("/:id", authenticate, updateEmergencyContact);
router.delete("/:id", authenticate, deleteEmergencyContact);

export default router;