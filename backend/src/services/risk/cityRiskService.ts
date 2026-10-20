import prisma from "../../config/prisma.js";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

interface CityRisk {
  city: string;
  incidentCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

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

function getCrimeWeight(category: string | null): number {
  if (!category) return 3;

  return CRIME_WEIGHTS[category.toUpperCase()] ?? 3;
}

function getCommunityWeight(category: string | null): number {
  if (!category) return 3;

  return COMMUNITY_WEIGHTS[
    category.toUpperCase()
  ] ?? 3;
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export async function getCityRisk(): Promise<CityRisk[]> {
  const [publicIncidents, communityReports] = await Promise.all([
    prisma.publicReferenceIncident.findMany({
      select: {
        city: true,
        category: true,
      },
      where: {
        city: {
          not: null,
        },
      },
    }),

    prisma.communityReport.findMany({
      select: {
        city: true,
        category: true,
      },
      where: {
        city: {
          not: null,
        },
        status: "SUBMITTED",
      },
    }),
  ]);

  const cityMap = new Map<
    string,
    {
      incidentCount: number;
      weightedRisk: number;
    }
  >();

  // -----------------------------------------
  // PUBLIC REFERENCE DATA
  // -----------------------------------------

  for (const incident of publicIncidents) {
    if (!incident.city) continue;

    const city = incident.city.trim();

    const current = cityMap.get(city) ?? {
      incidentCount: 0,
      weightedRisk: 0,
    };

    current.incidentCount += 1;
    current.weightedRisk += getCrimeWeight(incident.category);

    cityMap.set(city, current);
  }

  // -----------------------------------------
  // SWASHAKTI COMMUNITY REPORTS
  // -----------------------------------------

  for (const report of communityReports) {
    if (!report.city) continue;

    const city = report.city.trim();

    const current = cityMap.get(city) ?? {
      incidentCount: 0,
      weightedRisk: 0,
    };

    current.incidentCount += 1;
    current.weightedRisk += getCommunityWeight(report.category);

    cityMap.set(city, current);
  }

  // -----------------------------------------
  // CALCULATE FINAL CITY RISK
  // -----------------------------------------

  const results: CityRisk[] = [];

  for (const [city, data] of cityMap.entries()) {
    const averageSeverity =
      data.weightedRisk / data.incidentCount;

    const severityScore = averageSeverity * 10;

    results.push({
      city,
      incidentCount: data.incidentCount,
      riskScore: Number(severityScore.toFixed(2)),
      riskLevel: getRiskLevel(severityScore),
    });
  }

  return results.sort(
    (a, b) => b.riskScore - a.riskScore
  );
}

export async function getCityRiskByName(
  cityName: string
): Promise<CityRisk | null> {

  const [publicIncidents, communityReports] = await Promise.all([
    prisma.publicReferenceIncident.findMany({
      where: {
        city: {
          equals: cityName,
          mode: "insensitive",
        },
      },
      select: {
        city: true,
        category: true,
      },
    }),

    prisma.communityReport.findMany({
      where: {
        city: {
          equals: cityName,
          mode: "insensitive",
        },
        status: "SUBMITTED",
      },
      select: {
        city: true,
        category: true,
      },
    }),
  ]);

  if (
    publicIncidents.length === 0 &&
    communityReports.length === 0
  ) {
    return null;
  }

  let weightedRisk = 0;
  let incidentCount = 0;

  // -----------------------------------------
  // PUBLIC REFERENCE DATA
  // -----------------------------------------

  for (const incident of publicIncidents) {
    weightedRisk += getCrimeWeight(incident.category);
    incidentCount += 1;
  }

  // -----------------------------------------
  // SWASHAKTI COMMUNITY REPORTS
  // -----------------------------------------

  for (const report of communityReports) {
    weightedRisk += getCommunityWeight(report.category);
    incidentCount += 1;
  }

  // -----------------------------------------
  // CALCULATE FINAL CITY RISK
  // -----------------------------------------

  const averageSeverity = weightedRisk / incidentCount;
  const riskScore = averageSeverity * 10;

  const firstIncident =
    publicIncidents[0] ?? communityReports[0];

  if (!firstIncident || !firstIncident.city) {
    return null;
  }

  return {
    city: firstIncident.city.trim(),
    incidentCount,
    riskScore: Number(riskScore.toFixed(2)),
    riskLevel: getRiskLevel(riskScore),
  };
}