export interface CommunityReportPayload {
  category: string;
  description: string;
  location: string;
  locationPrecision?: string;
  occurredAt?: string;
  evidence?: File | null;
}

export interface CommunityReport {
  id: string;
  userId: string;
  category: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  locationPrecision: string;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  occurredAt?: string | null;
  evidenceUrl?: string | null;
  evidencePublicId?: string | null;
  evidenceType?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CommunityReportResponse {
  success: boolean;
  message: string;
  data: CommunityReport;
}

interface CommunityReportsResponse {
  success: boolean;
  count: number;
  data: CommunityReport[];
}

const API_BASE_URL = "http://localhost:5001/api";

const getToken = () => localStorage.getItem("token");

export async function submitCommunityReport(
  payload: CommunityReportPayload
): Promise<CommunityReport> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const formData = new FormData();

  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("location", payload.location);

  if (payload.locationPrecision) {
    formData.append(
      "locationPrecision",
      payload.locationPrecision
    );
  }

  if (payload.occurredAt) {
    formData.append("occurredAt", payload.occurredAt);
  }

  if (payload.evidence) {
  formData.append("file", payload.evidence);
}

  const response = await fetch(
    `${API_BASE_URL}/community-reports`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result: CommunityReportResponse =
    await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to submit community report"
    );
  }

  return result.data;
}

export async function getCommunityReports(): Promise<CommunityReport[]> {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${API_BASE_URL}/community-reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result: CommunityReportsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      "Failed to fetch community reports"
    );
  }

  return result.data;
}