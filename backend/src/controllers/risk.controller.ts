import type { Request, Response } from "express";

import {
  getCityRisk,
  getCityRiskByName,
} from "../services/risk/cityRiskService.js";

import {
  getCommunityAreaRisk,
  getCommunityAreaRiskByLocation,
} from "../services/risk/communityRiskService.js";

export async function getCityRiskController(
  req: Request,
  res: Response
) {
  const data = await getCityRisk();

  return res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
}

export async function getCityRiskByNameController(
  req: Request,
  res: Response
) {
  const cityName = req.params.city;

  if (!cityName) {
    return res.status(400).json({
      success: false,
      message: "City name is required",
    });
  }

  const data = await getCityRiskByName(cityName);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: `No public reference or community data found for city: ${cityName}`,
    });
  }

  return res.status(200).json({
    success: true,
    data,
  });
}

export async function getCommunityAreaRiskController(
  req: Request,
  res: Response
) {
  const data = await getCommunityAreaRisk();

  return res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
}

export async function getCommunityAreaRiskByLocationController(
  req: Request,
  res: Response
) {
  const locationName = req.params.location;

  if (!locationName) {
    return res.status(400).json({
      success: false,
      message: "Location is required",
    });
  }

  const data =
    await getCommunityAreaRiskByLocation(locationName);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: `No community reports found for location: ${locationName}`,
    });
  }

  return res.status(200).json({
    success: true,
    data,
  });
}