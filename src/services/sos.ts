import { SOSRequest, SOSResponse } from "../types/sos";

export async function sendSOS(
  data: SOSRequest
): Promise<SOSResponse> {
  console.log("SOS Payload:", data);

  // Backend API will be integrated later
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    message: "SOS sent successfully.",
  };
}