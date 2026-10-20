import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export interface SafetyAssistantRiskContext {
  location: string;
  city: string | null;

  incidentCount: number;
  publicReferenceIncidentCount: number;
  communityReportCount: number;

  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";

  categories?: {
    category: string;
    count: number;
  }[];

  dataSource?:
    | "PUBLIC_REFERENCE_DATA"
    | "COMMUNITY_REPORT"
    | "COMBINED";
}

interface SafetyAssistantInput {
  message: string;
  riskData: SafetyAssistantRiskContext | null;
}

/**
 * Deterministic fallback used when Gemini is unavailable.
 *
 * This function only uses the risk data already calculated
 * by SwaShakti. It does NOT calculate or modify the risk score.
 */
function generateDeterministicFallback(
  message: string,
  riskData: SafetyAssistantRiskContext | null
): string {
  const question = message.toLowerCase();

  // No risk data available
  if (!riskData) {
    if (
      question.includes("emergency") ||
      question.includes("danger") ||
      question.includes("help") ||
      question.includes("unsafe")
    ) {
      return (
        "I don't currently have nearby SwaShakti risk data for your location. " +
        "If you are in immediate danger, please use SwaShakti SOS, contact a trusted " +
        "contact, and contact local emergency services."
      );
    }

    return (
      "SwaShakti does not currently have enough nearby risk data to answer that " +
      "question reliably. You can continue using the safety map and report an " +
      "incident if you have relevant information."
    );
  }

  const location = riskData.location;
  const riskLevel = riskData.riskLevel;

  const categories = riskData.categories ?? [];

  const categoryText = categories.length
    ? categories
        .map(
          (item) =>
            `${item.category} (${item.count})`
        )
        .join(", ")
    : "No category information is currently available.";

  // Immediate emergency / danger
  if (
    question.includes("emergency") ||
    question.includes("currently in danger") ||
    question.includes("i am in danger") ||
    question.includes("help me") ||
    question.includes("unsafe right now")
  ) {
    return (
      `If you are currently in danger near ${location}, please use the ` +
      `SwaShakti SOS feature immediately and contact a trusted contact or ` +
      `local emergency services. The available SwaShakti data shows a ` +
      `${riskLevel} risk level for this area.`
    );
  }

  // Why is this area risky?
  if (
    question.includes("why") &&
    (
      question.includes("risk") ||
      question.includes("high") ||
      question.includes("danger")
    )
  ) {
    return (
      `${location} currently has a ${riskLevel} risk level according to ` +
      `SwaShakti's existing risk assessment. The area has ` +
      `${riskData.incidentCount} recorded incident(s). ` +
      `The reported categories are: ${categoryText}. ` +
      `These figures describe the available SwaShakti data and do not by ` +
      `themselves establish that the area is objectively dangerous.`
    );
  }

  // What incidents were reported?
  if (
    question.includes("incident") ||
    question.includes("reported") ||
    question.includes("reports")
  ) {
    return (
      `SwaShakti currently has ${riskData.incidentCount} recorded incident(s) ` +
      `for ${location}. ` +
      `${riskData.communityReportCount} are community report(s), while ` +
      `${riskData.publicReferenceIncidentCount} come from public reference data. ` +
      `Reported categories include: ${categoryText}.`
    );
  }

  // Public data question
  if (
    question.includes("public data") ||
    question.includes("public reference") ||
    question.includes("dataset")
  ) {
    return (
      `${location} currently has ` +
      `${riskData.publicReferenceIncidentCount} incident(s) from public ` +
      `reference data. SwaShakti also has ` +
      `${riskData.communityReportCount} community report(s) for this area.`
    );
  }

  // Community reports question
  if (
    question.includes("community") ||
    question.includes("user report") ||
    question.includes("people report")
  ) {
    return (
      `SwaShakti currently has ${riskData.communityReportCount} community ` +
      `report(s) associated with ${location}. `
      + (
        riskData.communityReportCount > 0
          ? `The reported categories include: ${categoryText}.`
          : "There are currently no community reports available for this area."
      )
    );
  }

  // Precautions / safety recommendations
  if (
    question.includes("precaution") ||
    question.includes("safe") ||
    question.includes("safety") ||
    question.includes("protect") ||
    question.includes("avoid")
  ) {
    if (riskLevel === "HIGH") {
      return (
        `${location} currently has a HIGH risk level in SwaShakti's data. ` +
        `Consider staying aware of your surroundings, using well-populated ` +
        `routes where practical, keeping your phone accessible, and informing ` +
        `a trusted contact about your journey. If you feel unsafe, use ` +
        `SwaShakti SOS.`
      );
    }

    if (riskLevel === "MEDIUM") {
      return (
        `${location} currently has a MEDIUM risk level in SwaShakti's data. ` +
        `Stay aware of your surroundings, prefer populated routes when ` +
        `practical, keep your phone accessible, and consider sharing your ` +
        `journey with a trusted contact.`
      );
    }

    return (
      `${location} currently has a LOW risk level in SwaShakti's data. ` +
      `Continue following normal safety practices, stay aware of your ` +
      `surroundings, and keep your phone accessible.`
    );
  }

  // Generic risk question
  if (
    question.includes("risk") ||
    question.includes("score") ||
    question.includes("level")
  ) {
    return (
      `${location} currently has a ${riskLevel} risk level with a SwaShakti ` +
      `risk score of ${riskData.riskScore}. There are ` +
      `${riskData.incidentCount} recorded incident(s), including ` +
      `${riskData.communityReportCount} community report(s) and ` +
      `${riskData.publicReferenceIncidentCount} public reference incident(s). ` +
      `The score and risk level are provided by SwaShakti's existing risk ` +
      `engine; I do not independently calculate them.`
    );
  }

  // General fallback
  return (
    `For ${location}, SwaShakti currently reports a ${riskLevel} risk level ` +
    `with ${riskData.incidentCount} recorded incident(s). ` +
    `The available categories are: ${categoryText}. ` +
    `I can answer questions about the area's risk level, reported incidents, ` +
    `community reports, public reference data, or practical safety precautions.`
  );
}

export async function generateSafetyAssistantResponse(
  input: SafetyAssistantInput
): Promise<string> {
  const { message, riskData } = input;

  const riskContext = riskData
    ? `
CURRENT SWASHAKTI RISK DATA

Location: ${riskData.location}
City: ${riskData.city ?? "Unknown"}

Risk Level: ${riskData.riskLevel}
Risk Score: ${riskData.riskScore}

Total Incidents: ${riskData.incidentCount}
Community Reports: ${riskData.communityReportCount}
Public Reference Incidents: ${
        riskData.publicReferenceIncidentCount
      }

Reported Categories:
${
  riskData.categories?.length
    ? riskData.categories
        .map(
          (item) =>
            `- ${item.category}: ${item.count}`
        )
        .join("\n")
    : "- No category information available"
}

Data Source:
${riskData.dataSource ?? "Unknown"}
`
    : `
No nearby SwaShakti risk data is currently
available for this user.
`;

  const prompt = `
You are the SwaShakti AI Safety Assistant.

SwaShakti is a women's safety, mobility and
emergency-support platform.

Your job is to answer safety-related questions
using the SwaShakti data supplied below.

IMPORTANT RULES:

1. Never calculate, modify or invent a risk score.

2. The risk level and risk score supplied by
   SwaShakti are authoritative.

3. Never invent incidents, crime statistics,
   locations or reports.

4. Clearly distinguish between:
   - SwaShakti community reports
   - public reference data

5. If available data is limited, clearly say so.

6. Do not claim that an area is objectively safe
   or dangerous solely from this dataset.

7. Give practical, calm and non-alarmist safety
   recommendations.

8. If the question cannot be answered from the
   supplied data, say that SwaShakti does not
   currently have enough information.

9. Keep normal answers concise and easy to read.

10. If the user describes an immediate emergency
    or says they are currently in danger, advise
    them to use SwaShakti SOS and contact local
    emergency services or a trusted contact.

${riskContext}

USER QUESTION:

${message}

Answer as the SwaShakti AI Safety Assistant.
`;

  try {
    const models = [
      "gemini-3.8-flash",
      "gemini-3.5-flash",
    ];

    let lastError: unknown = null;

    for (const model of models) {
      try {
        console.log(
          `Generating AI safety assistant response using ${model}`
        );

        const response =
          await ai.models.generateContent({
            model,
            contents: prompt,
          });

        const text = response.text;

        if (!text) {
          throw new Error(
            "Gemini returned an empty response"
          );
        }

        return text;
      } catch (error) {
        lastError = error;

        console.error(
          `Gemini error using ${model}:`,
          error
        );

        console.log(
          `Gemini model ${model} failed. Trying the next model...`
        );
      }
    }

    // Gemini unavailable → deterministic SwaShakti fallback
    console.log(
      "All Gemini models unavailable. Using deterministic SwaShakti fallback."
    );

    return generateDeterministicFallback(
      message,
      riskData
    );
  } catch (error) {
    console.error(
      "AI Safety Assistant Gemini error:",
      error
    );

    // Final safety net
    return generateDeterministicFallback(
      message,
      riskData
    );
  }
}