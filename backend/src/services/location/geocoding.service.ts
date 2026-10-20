
export interface GeocodingCandidate {
  latitude: number;
  longitude: number;
  displayName: string;
  city?: string;
  district?: string;
  state?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name?: string;
  importance?: number;
  type?: string;
  class?: string;
  addresstype?: string;
  address?: {
    city?: string;
    town?: string;
    municipality?: string;
    village?: string;
    state?: string;
    state_district?: string;
    county?: string;
  };
}

function clean(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

function hasValidCoordinates(result: NominatimResult): boolean {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);

  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

async function searchNominatim(
  query: string
): Promise<NominatimResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");

  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("dedupe", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "SwaShakti/1.0",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const message =
      `Nominatim failed for "${query}": ` +
      `${response.status} ${response.statusText}`;

    console.error(message);
    throw new Error(message);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Nominatim returned an unexpected response.");
  }

  return data as NominatimResult[];
}

export async function geocodeLocation(
  location: string
): Promise<GeocodingCandidate[]> {
  const cleanedLocation = location.trim();

  if (!cleanedLocation) {
    return [];
  }

  // Try the original query first so searches for other Indian
  // cities are not biased toward Madhya Pradesh.
  const queries = [
    cleanedLocation,
    `${cleanedLocation}, India`,
  ];

  const seen = new Set<string>();
  const candidates: NominatimResult[] = [];

  try {
    for (const query of queries) {
      console.log(`Geocoding query: "${query}"`);

      const results = await searchNominatim(query);

      for (const result of results) {
        if (!hasValidCoordinates(result)) continue;

        const latitude = Number(result.lat);
        const longitude = Number(result.lon);
        const key = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;

        if (!seen.has(key)) {
          seen.add(key);
          candidates.push(result);
        }
      }

      // Avoid unnecessary requests if we already have results.
      if (candidates.length >= 5) {
        break;
      }
    }
  } catch (error) {
    console.error("Geocoding service request failed:", error);

    // Do not silently report an upstream service failure as
    // a genuine "location not found" result.
    throw new Error(
      "The location search service is temporarily unavailable. Please try again."
    );
  }

  if (candidates.length === 0) {
    console.warn("No geocoding results found for:", cleanedLocation);
    return [];
  }

  const normalizedQuery = cleanedLocation
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const queryWords = normalizedQuery
    .split(" ")
    .filter((word) => word.length > 1);

  const ranked = candidates
    .map((result) => {
      const type = (
        result.addresstype ?? result.type ?? result.class ?? ""
      ).toLowerCase();

      const name = (result.display_name ?? "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ");

      const matchedWords = queryWords.filter((word) =>
        name.includes(word)
      );

      const matchRatio = queryWords.length
        ? matchedWords.length / queryWords.length
        : 0;

      let score = matchRatio * 10;
      score += (result.importance ?? 0) * 0.1;

      if (
        ["building", "amenity", "shop", "office", "tourism"]
          .includes(type)
      ) {
        score += 0.2;
      }

      if (
        ["state", "county", "state_district", "country"]
          .includes(type)
      ) {
        score -= 2;
      }

      return { result, score };
    })
    .sort((a, b) => b.score - a.score);

  const output: GeocodingCandidate[] = ranked.map(({ result }) => {
    const address = result.address ?? {};

    return {
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      displayName: result.display_name ?? cleanedLocation,
      city:
        clean(address.city) ??
        clean(address.town) ??
        clean(address.municipality) ??
        clean(address.village),
      district:
        clean(address.state_district) ??
        clean(address.county),
      state: clean(address.state),
    };
  });

  console.table(
    output.map((candidate) => ({
      name: candidate.displayName,
      latitude: candidate.latitude,
      longitude: candidate.longitude,
    }))
  );

  return output;
}
