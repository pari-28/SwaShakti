
import { useCallback, useEffect, useRef, useState } from "react";
import { LocationData } from "../types/location";
import { reverseGeocode } from "../services/location";

const DISTANCE_THRESHOLD = 50;
const MINOR_MOVEMENT_THRESHOLD = 5;
const GEOCODE_INTERVAL = 60000;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
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
  const [isTracking, setIsTracking] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  const lastGeocodeLocation = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const lastGeocodeTime = useRef(0);
  const cachedAddress = useRef("Fetching current location...");

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    // Reuse the existing watcher if tracking is already active.
    if (watchIdRef.current !== null) return;

    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (import.meta.env.DEV) {
          console.log("[GPS SUCCESS]", {
            latitude,
            longitude,
            accuracy,
            timestamp: position.timestamp,
          });
        }

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

          if (distance >= DISTANCE_THRESHOLD) {
            shouldGeocode = true;
          } else if (
            distance > MINOR_MOVEMENT_THRESHOLD &&
            elapsed >= GEOCODE_INTERVAL
          ) {
            shouldGeocode = true;
          }

          if (import.meta.env.DEV) {
            console.log(
              `Distance: ${distance.toFixed(2)}m | Elapsed: ${elapsed}ms`
            );
          }
        }

        if (shouldGeocode) {
          try {
            const newAddress = await reverseGeocode(latitude, longitude);

            if (newAddress) {
              address = newAddress;
              cachedAddress.current = newAddress;
            }

            lastGeocodeLocation.current = { latitude, longitude };
            lastGeocodeTime.current = now;
          } catch (geocodeError) {
            if (import.meta.env.DEV) {
              console.warn("Reverse geocoding failed:", geocodeError);
            }

            address = cachedAddress.current;
            lastGeocodeLocation.current = { latitude, longitude };
            lastGeocodeTime.current = now;
          }
        }

        // Ignore updates if the watcher was stopped while geocoding.
        if (watchIdRef.current === null) return;

        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
          address,
        });

        setError(null);
      },
      (err) => {
        if (import.meta.env.DEV) {
          console.warn("[GPS] Location update failed", {
            code: err.code,
            message: err.message,
            timestamp: new Date().toISOString(),
          });
        }

        if (err.code === 1) {
          setError("Location permission was denied.");
        } else if (err.code === 2) {
          setError(
            "Your current location is unavailable. Please check your GPS settings."
          );
        } else if (err.code === 3) {
          setError(
            "Location request timed out. Waiting for another GPS update."
          );
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    setIsTracking(true);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(false);
  }, []);

  // Automatically start tracking when this hook mounts.
  useEffect(() => {
    mountedRef.current = true;
    startTracking();

    return () => {
      mountedRef.current = false;

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [startTracking]);

  return {
    location,
    error,
    isTracking,
    startTracking,
    stopTracking,
  };
}
