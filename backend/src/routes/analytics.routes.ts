import { Router, type RequestHandler } from "express";
import { authenticate } from "../middleware/auth.middleware";
import AnalyticsController from "../controllers/analytics.controller";

const router = Router();

router.get(
  "/community-reports",
  authenticate as RequestHandler,
  AnalyticsController.getCommunityReports
);

export default router;
