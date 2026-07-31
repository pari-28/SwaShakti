export interface SOSRequest {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  timestamp: number;
}

export interface SOSResponse {
  success: boolean;
  message: string;
}