import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import AnalyticsService from "../services/analytics.service";

export class AnalyticsController {
  static getCommunityReports = asyncHandler(
    async (_req: Request, res: Response) => {
      const data =
        await AnalyticsService.getCommunityReportsLast7Days();

      res.status(200).json({
        success: true,
        data,
      });
    }
  );
}

export default AnalyticsController;
