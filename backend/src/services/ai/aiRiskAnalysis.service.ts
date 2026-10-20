import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

const MAX_RETRIES = 2;

export interface RiskAnalysisInput {
  location: string;
  city: string | null;

  incidentCount: number;
  publicReferenceIncidentCount: number;
  communityReportCount: number;

  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  categories: {
    category: string;
    count: number;
  }[];
}

function isTemporaryGeminiError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  return (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("temporarily unavailable")
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createFallbackAnalysis(
  data: RiskAnalysisInput
): string {
  const sourceDescription =
    data.publicReferenceIncidentCount > 0 &&
    data.communityReportCount > 0
      ? `${data.communityReportCount} SwaShakti community reports and ${data.publicReferenceIncidentCount} public reference incidents`
      : data.communityReportCount > 0
      ? `${data.communityReportCount} SwaShakti community reports`
      : `${data.publicReferenceIncidentCount} public reference incidents`;

  const categoryText =
    data.categories.length > 0
      ? data.categories
          .map((item) => `${item.category} (${item.count})`)
          .join(", ")
      : "no category breakdown available";

  return `Risk Summary:
The existing SwaShakti risk engine classifies this area as ${data.riskLevel} with a risk score of ${data.riskScore}. The available data includes ${sourceDescription}.

Key Factors:
- The current risk score is ${data.riskScore}.
- The available incident categories are: ${categoryText}.
- The dataset contains ${data.incidentCount} total incidents.

Safety Recommendations:
- Stay aware of your surroundings when travelling through the area.
- Consider sharing your travel plans or live location with a trusted contact.
- Use SwaShakti's safety and risk information when planning your route.

Data Note:
This analysis is based only on the currently available SwaShakti risk data and does not independently determine the risk score.`;
}

export async function generateRiskAnalysis(
  data: RiskAnalysisInput
): Promise<string> {
  const prompt = `
You are the AI safety analysis assistant for SwaShakti, a women's safety,
mobility and emergency-support platform.

Analyze the following EXISTING risk-engine data.

IMPORTANT RULES:
1. Do NOT calculate or change the risk score.
2. Do NOT invent incidents, statistics, locations, or causes.
3. Only use facts explicitly provided below.
4. Clearly distinguish between public reference data and SwaShakti community reports.
5. If the available data is limited, explicitly say that the analysis is based on limited available data.
6. Give practical but non-alarmist safety recommendations.
7. Do not claim that an area is objectively dangerous solely from this dataset.
8. Do not provide emergency-service instructions unless relevant.
9. Keep the response concise and easy to understand.

LOCATION:
${data.location}

CITY:
${data.city ?? "Not available"}

RISK SCORE:
${data.riskScore}

RISK LEVEL:
${data.riskLevel}

TOTAL INCIDENTS:
${data.incidentCount}

PUBLIC REFERENCE INCIDENTS:
${data.publicReferenceIncidentCount}

SWASHAKTI COMMUNITY REPORTS:
${data.communityReportCount}

INCIDENT CATEGORIES:
${
  data.categories.length > 0
    ? data.categories
        .map((item) => `- ${item.category}: ${item.count}`)
        .join("\n")
    : "No category breakdown available."
}

Return the analysis using exactly these sections:

Risk Summary:
<2-3 sentences>

Key Factors:
- <factor>
- <factor>
- <factor>

Safety Recommendations:
- <recommendation>
- <recommendation>
- <recommendation>

Data Note:
<one short sentence explaining the available data and its limitations>
`;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(
          `Generating AI risk analysis using ${model} (attempt ${attempt})`
        );

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        const text = response.text?.trim();

        if (text) {
          return text;
        }

        throw new Error("Gemini returned an empty response.");
      } catch (error) {
        console.error(
          `Gemini error using ${model} (attempt ${attempt}):`,
          error
        );

        if (!isTemporaryGeminiError(error)) {
          break;
        }

        if (attempt < MAX_RETRIES) {
          await wait(1500 * attempt);
        }
      }
    }

    console.warn(
      `Gemini model ${model} failed. Trying the next model...`
    );
  }

  console.warn(
    "All Gemini models were temporarily unavailable. Using deterministic fallback."
  );

  return createFallbackAnalysis(data);
}