export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface CityRisk {
  city: string;
  incidentCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

interface CityRiskResponse {
  success: boolean;
  count: number;
  data: CityRisk[];
}

export interface CommunityAreaRisk {
  location: string;
  city: string | null;
  incidentCount: number;

  publicReferenceIncidentCount: number;
  communityReportCount: number;

  riskScore: number;
  riskLevel: RiskLevel;

  latitude: number | null;
  longitude: number | null;

    categories: {
    category: string;
    count: number;
  }[];

  dataSource:
    | "PUBLIC_REFERENCE_DATA"
    | "COMMUNITY_REPORT"
    | "COMBINED";
}

interface CommunityAreaRiskResponse {
  success: boolean;
  count: number;
  data: CommunityAreaRisk[];
}

const API_BASE_URL = "http://localhost:5001/api";

export async function getCityRisk(): Promise<CityRisk[]> {
  const response = await fetch(`${API_BASE_URL}/risk/cities`);

  if (!response.ok) {
    throw new Error("Failed to fetch city risk data");
  }

  const result: CityRiskResponse = await response.json();

  if (!result.success) {
    throw new Error("Risk API returned an unsuccessful response");
  }

  return result.data;
}

export async function getCityRiskByName(
  city: string
): Promise<CityRisk | null> {
  const cities = await getCityRisk();

  const normalizedCity = city.trim().toLowerCase();

  const match = cities.find(
    (item) => item.city.trim().toLowerCase() === normalizedCity
  );

  return match ?? null;
}

export async function getCommunityAreaRisk(): Promise<
  CommunityAreaRisk[]
> {
  const response = await fetch(`${API_BASE_URL}/risk/areas`);

  if (!response.ok) {
    throw new Error("Failed to fetch community area risk data");
  }

  const result: CommunityAreaRiskResponse = await response.json();

  if (!result.success) {
    throw new Error(
      "Community risk API returned an unsuccessful response"
    );
  }

  return result.data;
}

/**
 * Find the nearest risk area to the user's current GPS location.
 *
 * This is important because reverse geocoding may return values such as
 * "Ashta Tahsil", while our stored community/public data may use
 * "ashta, sehore, mp".
 */
export async function getNearestRiskArea(
  latitude: number,
  longitude: number
): Promise<CommunityAreaRisk | null> {
  const areas = await getCommunityAreaRisk();

  const areasWithCoordinates = areas.filter(
    (area) =>
      area.latitude !== null &&
      area.longitude !== null
  );

  if (areasWithCoordinates.length === 0) {
    return null;
  }

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const distanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  };

  let nearestArea: CommunityAreaRisk | null = null;
  let nearestDistance = Infinity;

  for (const area of areasWithCoordinates) {
    const distance = distanceInKm(
      latitude,
      longitude,
      area.latitude!,
      area.longitude!
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestArea = area;
    }
  }

  /**
 * Allow a wider lookup radius because community/public
 * reference points may represent a larger administrative area
 * such as a tehsil rather than the exact GPS point.
 *
 * 75 km is a data-coverage boundary, not a claim that the
 * entire 75 km region has the same risk level.
 */
if (nearestDistance > 75) {
  return null;
}

  return nearestArea;
}