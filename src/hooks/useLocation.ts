import { useEffect, useRef, useState } from "react";
import { LocationData } from "../types/location";
import { reverseGeocode } from "../services/location";

const DISTANCE_THRESHOLD = 50; // Immediate update (meters)
const MINOR_MOVEMENT_THRESHOLD = 5; // Slight movement (meters)
const GEOCODE_INTERVAL = 60000; // 1 minute

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

   const lastGeocodeLocation = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const lastGeocodeTime = useRef(0);

  const cachedAddress = useRef<string>("Fetching current location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
     async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  let address = cachedAddress.current;

  const now = Date.now();

  let shouldGeocode = false;

  if (!lastGeocodeLocation.current) {
    shouldGeocode = true;
  } else {
    const distance = calculateDistance(
  lastGeocodeLocation.current.latitude,
  lastGeocodeLocation.current.longitude,
  latitude,
  longitude
);

const elapsed = now - lastGeocodeTime.current;

if (import.meta.env.DEV) {
  console.log(
    `Distance: ${distance.toFixed(2)}m | Elapsed: ${elapsed}ms`
  );
}

// Refresh immediately if user moved significantly
if (distance >= DISTANCE_THRESHOLD) {
  shouldGeocode = true;
}
// Refresh after some time only if user has moved a little
else if (
  distance > MINOR_MOVEMENT_THRESHOLD &&
  elapsed >= GEOCODE_INTERVAL
) {
  shouldGeocode = true;
}
  }

  if (shouldGeocode) {
  try {
    if (import.meta.env.DEV) {
  console.log("Reverse geocoding...", {
    latitude,
    longitude,
  });
}

    const newAddress = await reverseGeocode(latitude, longitude);

if (newAddress) {
  address = newAddress;
  cachedAddress.current = newAddress;
}
    // Save location for future distance calculations
    lastGeocodeLocation.current = {
      latitude,
      longitude,
    };

    // Save the time of this successful geocode
    lastGeocodeTime.current = now;
  } catch (error) {
  console.error("Reverse geocoding failed:", error);

  // Keep previous address
  address = cachedAddress.current;

  // Save current coordinates
  lastGeocodeLocation.current = {
    latitude,
    longitude,
  };

  // Prevent immediate retry on the next GPS update
  lastGeocodeTime.current = now;
}
}

  if (!shouldGeocode) {
  if (import.meta.env.DEV) {
  console.log("Using cached address", {
    latitude,
    longitude,
  });
}
}


  setLocation({
    latitude,
    longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
    address,
  });
},
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
}