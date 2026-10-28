export interface DailyCommunityReportCount {
  date: string;
  count: number;
}

interface AnalyticsResponse {
  success: boolean;
  data: DailyCommunityReportCount[];
}

const API_BASE_URL = "http://localhost:5001/api";

export async function getCommunityReportAnalytics(): Promise<
  DailyCommunityReportCount[]
> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `${API_BASE_URL}/analytics/community-reports`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result: AnalyticsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error("Failed to fetch community report analytics");
  }

  return result.data;
}
