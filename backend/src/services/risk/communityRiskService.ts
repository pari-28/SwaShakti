import prisma from "../../config/prisma.js";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface CommunityAreaRisk {
  location: string;
  city: string | null;

  // Combined count used for the current risk calculation
  incidentCount: number;

  // Explicit source breakdown
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

export interface AreaRiskAnalysisData {
  location: string;
  city: string | null;

  incidentCount: number;
  publicReferenceIncidentCount: number;
  communityReportCount: number;

  riskScore: number;
  riskLevel: RiskLevel;

  categories: {
    category: string;
    count: number;
  }[];
}

const COMMUNITY_WEIGHTS: Record<string, number> = {
  HARASSMENT: 7,
  STALKING: 8,
  "UNSAFE AREA": 6,
  THEFT: 5,
  ASSAULT: 8,
  "VERBAL ABUSE": 5,
  "SUSPICIOUS ACTIVITY": 6,
  OTHER: 3,
};

const CRIME_WEIGHTS: Record<string, number> = {
  HOMICIDE: 10,
  KIDNAPPING: 9,
  "SEXUAL ASSAULT": 10,
  ASSAULT: 8,
  ROBBERY: 8,
  EXTORTION: 7,
  ARSON: 7,
  BURGLARY: 6,
  "VEHICLE - STOLEN": 5,
  "DRUG OFFENSE": 5,
  VANDALISM: 4,
  CYBERCRIME: 4,
  "IDENTITY THEFT": 3,
  FRAUD: 3,
  COUNTERFEITING: 3,
  "PUBLIC INTOXICATION": 2,
};

function getCommunityWeight(category: string | null): number {
  if (!category) return 3;

  return COMMUNITY_WEIGHTS[category.toUpperCase()] ?? 3;
}

function getCrimeWeight(category: string | null): number {
  if (!category) return 3;

  return CRIME_WEIGHTS[category.toUpperCase()] ?? 3;
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

function normalizeLocation(location: string): string {
  return location
    .trim()
    .replace(/\s+/g, " ");
}

function isUsableLocation(location: string): boolean {
  const normalized = normalizeLocation(location).toLowerCase();

  const invalidValues = new Set([
    "unknown",
    "n/a",
    "na",
    "none",
    "null",
    "not available",
    "not provided",
    "unspecified",
  ]);

  return normalized.length >= 2 && !invalidValues.has(normalized);
}

function getLocationKey(location: string): string {
  let normalized = normalizeLocation(location).toLowerCase();

  normalized = normalized
    .replace(/,\s*mp$/i, "")
    .replace(/,\s*madhya pradesh$/i, "")
    .replace(/,\s*india$/i, "")
    .trim();

  const cityAliases: Record<string, string> = {
    banglore: "bangalore",
    bangluru: "bangalore",
    bengaluru: "bangalore",
    bangalore: "bangalore",
    kerela: "kerala",
    kerala: "kerala",
  };

  const firstPart = normalized.split(",")[0].trim();

  if (cityAliases[firstPart]) {
    return cityAliases[firstPart];
  }

  return normalized;
}

function getCanonicalLocation(location: string): string {
  const key = getLocationKey(location);

  const canonicalNames: Record<string, string> = {
    bangalore: "Bangalore",
    kerala: "Kerala",
  };

  return canonicalNames[key] ?? normalizeLocation(location);
}

const CITY_COORDINATES: Record<
  string,
  { latitude: number; longitude: number }
> = {
  mumbai: { latitude: 19.076, longitude: 72.8777 },
  delhi: { latitude: 28.6139, longitude: 77.209 },
  bangalore: { latitude: 12.9716, longitude: 77.5946 },
  bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  banglore: { latitude: 12.9716, longitude: 77.5946 },
  bangluru: { latitude: 12.9716, longitude: 77.5946 },
  hyderabad: { latitude: 17.385, longitude: 78.4867 },
  chennai: { latitude: 13.0827, longitude: 80.2707 },
  pune: { latitude: 18.5204, longitude: 73.8567 },
  ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
  kolkata: { latitude: 22.5726, longitude: 88.3639 },
  jaipur: { latitude: 26.9124, longitude: 75.7873 },
  lucknow: { latitude: 26.8467, longitude: 80.9462 },
  kanpur: { latitude: 26.4499, longitude: 80.3319 },
  nagpur: { latitude: 21.1458, longitude: 79.0882 },
  indore: { latitude: 22.7196, longitude: 75.8577 },
  bhopal: { latitude: 23.2599, longitude: 77.4126 },
  patna: { latitude: 25.5941, longitude: 85.1376 },
  surat: { latitude: 21.1702, longitude: 72.8311 },
  nashik: { latitude: 19.9975, longitude: 73.7898 },
  thane: { latitude: 19.2183, longitude: 72.9781 },
  faridabad: { latitude: 28.4089, longitude: 77.3178 },
  ghaziabad: { latitude: 28.6692, longitude: 77.4538 },
  meerut: { latitude: 28.9845, longitude: 77.7064 },
  ludhiana: { latitude: 30.901, longitude: 75.8573 },
  amritsar: { latitude: 31.634, longitude: 74.8723 },
  agra: { latitude: 27.1767, longitude: 78.0081 },
  varanasi: { latitude: 25.3176, longitude: 82.9739 },
  rajkot: { latitude: 22.3039, longitude: 70.8022 },
  visakhapatnam: { latitude: 17.6868, longitude: 83.2185 },
  srinagar: { latitude: 34.0837, longitude: 74.7973 },
  nainital: { latitude: 29.3919, longitude: 79.4542 },
  jabalpur: { latitude: 23.1815, longitude: 79.9864 },
  ajmer: { latitude: 26.4499, longitude: 74.6399 },
  sehore: { latitude: 23.2032, longitude: 77.0844 },
  vidisha: { latitude: 23.5251, longitude: 77.8081 },
  ashta: { latitude: 23.0176, longitude: 76.7224 },
  kalyan: { latitude: 19.2437, longitude: 73.1355 },
  vasai: { latitude: 19.3919, longitude: 72.8397 },
};

export async function getCommunityAreaRisk(): Promise<
  CommunityAreaRisk[]
> {
  const [communityReports, publicIncidents] = await Promise.all([
    prisma.communityReport.findMany({
      where: {
        status: "SUBMITTED",
      },
      select: {
        location: true,
        city: true,
        category: true,
        latitude: true,
        longitude: true,
      },
    }),

    prisma.publicReferenceIncident.findMany({
      select: {
        city: true,
        category: true,
        latitude: true,
        longitude: true,
      },
    }),
  ]);

  const areaMap = new Map<
    string,
    {
  location: string;
  city: string | null;
  incidentCount: number;
  publicReferenceIncidentCount: number;
  communityReportCount: number;
  weightedRisk: number;
  latitude: number | null;
  longitude: number | null;
  categories: Map<string, number>;
}
  >();

  // -----------------------------------------
  // SWASHAKTI COMMUNITY REPORTS
  // -----------------------------------------
  for (const report of communityReports) {
    if (!report.location?.trim()) continue;

    const rawLocation = normalizeLocation(report.location);

if (!isUsableLocation(rawLocation)) continue;

const key = getLocationKey(rawLocation);
const location = getCanonicalLocation(rawLocation);

const cityName = report.city?.trim() || null;

const cityCoordinates = cityName
  ? CITY_COORDINATES[cityName.toLowerCase()]
  : undefined;

const current = areaMap.get(key) ?? {
  location,
  city: cityName,
  incidentCount: 0,
  publicReferenceIncidentCount: 0,
  communityReportCount: 0,
  weightedRisk: 0,
  latitude:
    report.latitude ?? cityCoordinates?.latitude ?? null,
  longitude:
    report.longitude ?? cityCoordinates?.longitude ?? null,
  categories: new Map<string, number>(),
};

    current.incidentCount += 1;
    current.communityReportCount += 1;
    current.weightedRisk += getCommunityWeight(report.category);

    const category = report.category?.trim() || "OTHER";

current.categories.set(
  category,
  (current.categories.get(category) ?? 0) + 1
);

    // Keep coordinates from any community report that has them.
    if (
  current.latitude === null &&
  current.longitude === null
) {
  if (cityCoordinates) {
    current.latitude = cityCoordinates.latitude;
    current.longitude = cityCoordinates.longitude;
  } else if (
    report.latitude !== null &&
    report.longitude !== null
  ) {
    current.latitude = report.latitude;
    current.longitude = report.longitude;
  }
}

    areaMap.set(key, current);
  }

  // -----------------------------------------
  // PUBLIC REFERENCE DATA
  // -----------------------------------------

  for (const incident of publicIncidents) {
    if (!incident.city?.trim()) continue;

    const rawCity = normalizeLocation(incident.city);

if (!isUsableLocation(rawCity)) continue;

const key = getLocationKey(rawCity);
const location = getCanonicalLocation(rawCity);

    const cityCoordinates =
      CITY_COORDINATES[location.toLowerCase()];

    const current = areaMap.get(key) ?? {
      location,
      city: location,
      incidentCount: 0,
       publicReferenceIncidentCount: 0,
        communityReportCount: 0,
      weightedRisk: 0,
      latitude: cityCoordinates?.latitude ?? null,
      longitude: cityCoordinates?.longitude ?? null,
      categories: new Map<string, number>(),
    };

    current.incidentCount += 1;
current.publicReferenceIncidentCount += 1;
current.weightedRisk += getCrimeWeight(incident.category);

const category = incident.category?.trim() || "OTHER";

current.categories.set(
  category,
  (current.categories.get(category) ?? 0) + 1
);

    // Prefer our verified city coordinates over coordinates
    // supplied by the public reference dataset.
    if (
      current.latitude === null &&
      current.longitude === null &&
      cityCoordinates
    ) {
      current.latitude = cityCoordinates.latitude;
      current.longitude = cityCoordinates.longitude;
    }

    areaMap.set(key, current);
  }

  // -----------------------------------------
  // CALCULATE COMBINED AREA RISK
  // -----------------------------------------
  const results: CommunityAreaRisk[] = [];

  for (const area of areaMap.values()) {
    const averageSeverity =
      area.weightedRisk / area.incidentCount;

    const riskScore = averageSeverity * 10;

    const dataSource =
  area.publicReferenceIncidentCount > 0 &&
  area.communityReportCount > 0
    ? "COMBINED"
    : area.communityReportCount > 0
    ? "COMMUNITY_REPORT"
    : "PUBLIC_REFERENCE_DATA";

results.push({
  location: area.location,
  city: area.city,
  incidentCount: area.incidentCount,

  publicReferenceIncidentCount:
    area.publicReferenceIncidentCount,

  communityReportCount:
    area.communityReportCount,

  riskScore: Number(riskScore.toFixed(2)),
  riskLevel: getRiskLevel(riskScore),

  latitude: area.latitude,
  longitude: area.longitude,

  categories: Array.from(area.categories.entries()).map(
  ([category, count]) => ({
    category,
    count,
  })
),

  dataSource,
});
  }

  return results.sort(
    (a, b) => b.riskScore - a.riskScore
  );
}

export async function getCommunityAreaRiskByLocation(
  locationName: string
): Promise<CommunityAreaRisk | null> {
  const normalizedSearch = normalizeLocation(locationName);

  const reports = await prisma.communityReport.findMany({
    where: {
      status: "SUBMITTED",
      location: {
        equals: normalizedSearch,
        mode: "insensitive",
      },
    },
    select: {
      location: true,
      city: true,
      category: true,
      latitude: true,
      longitude: true,
    },
  });

  if (reports.length === 0) {
    return null;
  }

  let weightedRisk = 0;

  let latitude: number | null = null;
  let longitude: number | null = null;

  for (const report of reports) {
    weightedRisk += getCommunityWeight(report.category);

    if (
      latitude === null &&
      longitude === null &&
      report.latitude !== null &&
      report.longitude !== null
    ) {
      latitude = report.latitude;
      longitude = report.longitude;
    }
  }

  const averageSeverity =
    weightedRisk / reports.length;

  const riskScore = averageSeverity * 10;

  return {
    location: normalizeLocation(reports[0].location),
    city: reports[0].city?.trim() || null,
    incidentCount: reports.length,
    riskScore: Number(riskScore.toFixed(2)),
    riskLevel: getRiskLevel(riskScore),
    latitude,
    longitude,
  };
}

export async function getAreaRiskAnalysisData(
  locationName: string
): Promise<AreaRiskAnalysisData | null> {
  const normalizedLocation = normalizeLocation(locationName);

  const [communityReports, publicIncidents] = await Promise.all([
    prisma.communityReport.findMany({
      where: {
        status: "SUBMITTED",
        location: {
          equals: normalizedLocation,
          mode: "insensitive",
        },
      },
      select: {
        location: true,
        city: true,
        category: true,
      },
    }),

    prisma.publicReferenceIncident.findMany({
      where: {
        city: {
          equals: normalizedLocation,
          mode: "insensitive",
        },
      },
      select: {
        city: true,
        category: true,
      },
    }),
  ]);

  if (communityReports.length === 0 && publicIncidents.length === 0) {
    return null;
  }

  const categories = new Map<string, number>();

  let weightedRisk = 0;

  for (const report of communityReports) {
    const category = report.category?.trim() || "OTHER";

    categories.set(
      category,
      (categories.get(category) ?? 0) + 1
    );

    weightedRisk += getCommunityWeight(category);
  }

  for (const incident of publicIncidents) {
    const category = incident.category?.trim() || "OTHER";

    categories.set(
      category,
      (categories.get(category) ?? 0) + 1
    );

    weightedRisk += getCrimeWeight(category);
  }

  const incidentCount =
    communityReports.length + publicIncidents.length;

  const averageSeverity = weightedRisk / incidentCount;

  const riskScore = Number(
    (averageSeverity * 10).toFixed(2)
  );

  const riskLevel = getRiskLevel(riskScore);

  const city =
    communityReports[0]?.city ??
    publicIncidents[0]?.city ??
    null;

  return {
    location: normalizedLocation,
    city,

    incidentCount,

    publicReferenceIncidentCount: publicIncidents.length,
    communityReportCount: communityReports.length,

    riskScore,
    riskLevel,

    categories: Array.from(categories.entries()).map(
      ([category, count]) => ({
        category,
        count,
      })
    ),
  };
}