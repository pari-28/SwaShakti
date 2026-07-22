import { Router } from "express";
import SOSController from "../controllers/sos.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createSOSSchema,
  updateLocationSchema,
  updateStatusSchema,
} from "../validators/sos.validator";

const router = Router();


// 👇 Add this line
router.get("/active", authenticate, SOSController.getActive);

router.patch(
  "/:id/location",
  authenticate,
  SOSController.updateLocation
);

router.patch(
  "/:id/status",
  authenticate,
  SOSController.updateStatus
);

router.post(
  "/",
  authenticate,
  validate(createSOSSchema),
  SOSController.create
);

router.patch(
  "/:id/location",
  authenticate,
  validate(updateLocationSchema),
  SOSController.updateLocation
);

router.patch(
  "/:id/status",
  authenticate,
  validate(updateStatusSchema),
  SOSController.updateStatus
);

router.get("/history", authenticate, SOSController.getHistory);

export default router;