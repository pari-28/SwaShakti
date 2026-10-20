import { CommunityAreaRisk } from "./risk";
import { PlannedRoute } from "../types/route";

export interface RouteRiskArea {
  location: string;
  city: string | null;
  latitude: number;
  longitude: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  distanceFromRouteKm: number;
  incidentCount: number;
  categories: { category: string; count: number }[];
}

export interface RouteRiskAnalysis {
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  riskAreas: RouteRiskArea[];
  highRiskAreas: number;
  mediumRiskAreas: number;
  lowRiskAreas: number;
  recommendation: string;
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function distanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    2 *
    R *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function getMinimumDistanceToRoute(
  latitude: number,
  longitude: number,
  route: PlannedRoute
): number {
  let minimumDistance = Infinity;

  for (const [routeLongitude, routeLatitude] of route.geometry.coordinates) {
    const distance = distanceInKm(
      latitude,
      longitude,
      routeLatitude,
      routeLongitude
    );

    minimumDistance = Math.min(
      minimumDistance,
      distance
    );
  }

  return minimumDistance;
}

export function analyzeRouteRisk(
  route: PlannedRoute,
  riskAreas: CommunityAreaRisk[]
): RouteRiskAnalysis {
  /*
   * A risk area is considered relevant to the route
   * when it is within 1 km of the planned route.
   */
  const ROUTE_RISK_RADIUS_KM = 1;

  const relevantAreas: RouteRiskArea[] = [];

  for (const area of riskAreas) {
    if (
      area.latitude === null ||
      area.longitude === null
    ) {
      continue;
    }

    const distanceFromRouteKm =
      getMinimumDistanceToRoute(
        area.latitude,
        area.longitude,
        route
      );

    if (distanceFromRouteKm <= ROUTE_RISK_RADIUS_KM) {
      relevantAreas.push({
  location: area.location,
  city: area.city,
  latitude: area.latitude,
  longitude: area.longitude,
  riskScore: area.riskScore,
  riskLevel: area.riskLevel,
  distanceFromRouteKm,
  incidentCount: area.incidentCount,
  categories: area.categories,
});
    }
  }

  /*
   * Route risk is based on the highest-risk areas
   * encountered near the route.
   *
   * We are NOT creating a new incident score here.
   * The existing SwaShakti risk scores remain authoritative.
   */
  let riskScore = 0;

  for (const area of relevantAreas) {
    riskScore = Math.max(
      riskScore,
      area.riskScore
    );
  }

  const riskLevel =
    riskScore >= 70
      ? "HIGH"
      : riskScore >= 40
      ? "MEDIUM"
      : "LOW";

  const highRiskAreas = relevantAreas.filter(
    (area) => area.riskLevel === "HIGH"
  ).length;

  const mediumRiskAreas = relevantAreas.filter(
    (area) => area.riskLevel === "MEDIUM"
  ).length;

  const lowRiskAreas = relevantAreas.filter(
    (area) => area.riskLevel === "LOW"
  ).length;

  let recommendation =
    "No significant SwaShakti risk areas were detected near this route.";

  if (highRiskAreas > 0) {
    recommendation =
      "This route passes near high-risk areas identified by SwaShakti. Consider an alternate route if available.";
  } else if (mediumRiskAreas > 0) {
    recommendation =
      "This route passes near moderate-risk areas. Stay alert and consider a safer alternative when practical.";
  } else if (lowRiskAreas > 0) {
    recommendation =
      "This route passes near areas with recorded safety incidents, but the detected risk level is currently low.";
  }

  return {
    riskScore,
    riskLevel,
    riskAreas: relevantAreas.sort(
      (a, b) =>
        b.riskScore - a.riskScore
    ),
    highRiskAreas,
    mediumRiskAreas,
    lowRiskAreas,
    recommendation,
  };
}