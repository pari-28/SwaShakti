import type { Response } from "express";
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

      const report = await CommunityReportService.createReport({
        userId: req.userId!,
        category: req.body.category,
        description: req.body.description,

        // User-provided incident location
        location: req.body.location,
        locationPrecision: req.body.locationPrecision,

        // Automatically derived from INCIDENT location
        latitude: geocoded?.latitude,
        longitude: geocoded?.longitude,
        city: geocoded?.city,
        district: geocoded?.district,
        state: geocoded?.state,

        occurredAt: req.body.occurredAt,

        // Optional Cloudinary evidence
        evidenceUrl: file
          ? (file as any).path
          : undefined,

        evidencePublicId: file
          ? (file as any).filename
          : undefined,

        evidenceType,
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