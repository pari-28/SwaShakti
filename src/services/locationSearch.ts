
export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  displayName: string;
  city?: string;
  district?: string;
  state?: string;
}

interface LocationSearchResponse {
  success: boolean;
  data?: GeocodedLocation[];
  message?: string;
}

import { API_BASE_URL } from "../config/api";

export async function searchLocation(
  query: string
): Promise<GeocodedLocation[]> {
  const response = await fetch(
    `${API_BASE_URL}/location/search?q=${encodeURIComponent(query)}`
  );

  const data: LocationSearchResponse = await response.json();

  if (!response.ok || !data.success || !Array.isArray(data.data) || data.data.length === 0) {
    throw new Error(data.message || "Location not found.");
  }

  return data.data;
}
