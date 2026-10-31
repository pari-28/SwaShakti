import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { CommunityReportService } from "../services/communityReport.service";
import { geocodeLocation } from "../services/location/geocoding.service";

export class CommunityReportController {
  static create = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const file = req.file;

      let evidenceType: string | undefined;

      if (file) {
        if (file.mimetype.startsWith("image/")) {
          evidenceType = "IMAGE";
        } else if (file.mimetype.startsWith("video/")) {
          evidenceType = "VIDEO";
        } else if (file.mimetype.startsWith("audio/")) {
          evidenceType = "AUDIO";
        }
      }

      // -----------------------------------------
      // GEOCODE THE INCIDENT LOCATION
      // -----------------------------------------
      const geocoded = await geocodeLocation(req.body.location);

      const bestCandidate = geocoded[0];

const report = await CommunityReportService.createReport({
  userId: req.userId!,
  category: req.body.category,
  description: req.body.description,
  location: req.body.location,

  ...(req.body.locationPrecision !== undefined
    ? { locationPrecision: req.body.locationPrecision }
    : {}),

  ...(bestCandidate?.latitude !== undefined
    ? { latitude: bestCandidate.latitude }
    : {}),
  ...(bestCandidate?.longitude !== undefined
    ? { longitude: bestCandidate.longitude }
    : {}),
  ...(bestCandidate?.city ? { city: bestCandidate.city } : {}),
  ...(bestCandidate?.district ? { district: bestCandidate.district } : {}),
  ...(bestCandidate?.state ? { state: bestCandidate.state } : {}),

  ...(req.body.occurredAt !== undefined
    ? { occurredAt: req.body.occurredAt }
    : {}),

  ...(file ? { evidenceUrl: (file as any).path } : {}),
  ...(file ? { evidencePublicId: (file as any).filename } : {}),
  ...(evidenceType ? { evidenceType } : {}),
});

      return res.status(201).json({
        success: true,
        message: "Community report submitted successfully.",
        data: report,
      });
    }
  );

  static getMine = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const reports = await CommunityReportService.getReports(
        req.userId!
      );

      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports,
      });
    }
  );
}

export default CommunityReportController;