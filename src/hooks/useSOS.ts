import { useState } from "react";
import { sendSOS } from "../services/sos";
import { LocationData } from "../types/location";

export function useSOS() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmergencySOS = async (location: LocationData) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        accuracy: location.accuracy,
        timestamp: location.timestamp,
      };

      const response = await sendSOS(payload);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send SOS. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmergencySOS,
    loading,
    success,
    error,
  };
}