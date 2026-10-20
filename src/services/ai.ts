import { CommunityAreaRisk } from "./risk";
export interface AIRiskAnalysis {
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
  analysis: string;
}

interface AIRiskAnalysisResponse {
  success: boolean;
  data: AIRiskAnalysis;
}

const API_BASE_URL = "http://localhost:5001/api";

export async function getAIRiskAnalysis(
  riskData: CommunityAreaRisk
): Promise<AIRiskAnalysis> {
  const response = await fetch(
    `${API_BASE_URL}/ai/risk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(riskData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate AI risk analysis");
  }

  const result: AIRiskAnalysisResponse =
    await response.json();

  if (!result.success) {
    throw new Error("AI risk analysis request failed");
  }

  return result.data;
}