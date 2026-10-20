
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { geocodeLocation } from "../services/location/geocoding.service";

export const searchLocationController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = String(req.query.q ?? "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Location query is required",
      });
    }

    const results = await geocodeLocation(query);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    return res.json({
      success: true,
      data: results,
    });
  }
);
