
import { PlannedRoute } from "../types/route";

export type DeviationStatus =
  | "ON_ROUTE"
  | "OFF_ROUTE"
  | "GPS_UNRELIABLE"
  | "NO_ROUTE";

export interface DeviationResult {
  status: DeviationStatus;
  distanceMeters: number | null;
  gpsAccuracyMeters: number;
  message: string;
}

const MAX_ACCEPTABLE_GPS_ACCURACY_METERS = 50;
const DEVIATION_THRESHOLD_METERS = 100;

/**
 * Calculates the shortest distance from a GPS position
 * to any segment of the planned route.
 *
 * OSRM GeoJSON coordinates use [longitude, latitude].
 * Distance calculations use a local meter-based projection.
 */
export function getDistanceToRouteMeters(
  latitude: number,
  longitude: number,
  route: PlannedRoute
): number {
  const coordinates = route.geometry.coordinates;

  if (coordinates.length === 0) {
    return Infinity;
  }

  const earthRadiusMeters = 6_371_000;
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeScale = Math.cos(latitudeRadians);

  const toLocalMeters = (
    routeLongitude: number,
    routeLatitude: number
  ) => {
    const x =
      ((routeLongitude - longitude) * Math.PI / 180) *
      earthRadiusMeters *
      longitudeScale;

    const y =
      ((routeLatitude - latitude) * Math.PI / 180) *
      earthRadiusMeters;

    return { x, y };
  };

  // A route with one coordinate has no segments.
  if (coordinates.length === 1) {
    const [routeLongitude, routeLatitude] = coordinates[0];
    const point = toLocalMeters(routeLongitude, routeLatitude);

    return Math.hypot(point.x, point.y);
  }

  let minimumDistance = Infinity;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];

    const start = toLocalMeters(lon1, lat1);
    const end = toLocalMeters(lon2, lat2);

    const segmentX = end.x - start.x;
    const segmentY = end.y - start.y;
    const segmentLengthSquared =
      segmentX * segmentX + segmentY * segmentY;

    let t = 0;

    if (segmentLengthSquared > 0) {
      t = Math.max(
        0,
        Math.min(
          1,
          -(
            start.x * segmentX +
            start.y * segmentY
          ) / segmentLengthSquared
        )
      );
    }

    const nearestX = start.x + t * segmentX;
    const nearestY = start.y + t * segmentY;

    const distance = Math.hypot(nearestX, nearestY);
    minimumDistance = Math.min(minimumDistance, distance);
  }

  return minimumDistance;
}

/**
 * Classifies one GPS reading.
 *
 * This function does not trigger SOS or decide whether
 * a deviation is persistent. Persistence is handled next.
 */
export function evaluateRouteDeviation(
  latitude: number,
  longitude: number,
  accuracyMeters: number,
  route: PlannedRoute | null
): DeviationResult {
  if (!route || route.geometry.coordinates.length === 0) {
    return {
      status: "NO_ROUTE",
      distanceMeters: null,
      gpsAccuracyMeters: accuracyMeters,
      message: "Plan a route to start deviation monitoring.",
    };
  }

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(accuracyMeters) ||
    accuracyMeters < 0 ||
    accuracyMeters > MAX_ACCEPTABLE_GPS_ACCURACY_METERS
  ) {
    return {
      status: "GPS_UNRELIABLE",
      distanceMeters: null,
      gpsAccuracyMeters: accuracyMeters,
      message:
        "GPS accuracy is insufficient. Waiting for a more reliable location.",
    };
  }

  const distanceMeters = getDistanceToRouteMeters(
    latitude,
    longitude,
    route
  );

  if (distanceMeters > DEVIATION_THRESHOLD_METERS) {
    return {
      status: "OFF_ROUTE",
      distanceMeters,
      gpsAccuracyMeters: accuracyMeters,
      message: `You are approximately ${Math.round(
        distanceMeters
      )} m from your planned route.`,
    };
  }

  return {
    status: "ON_ROUTE",
    distanceMeters,
    gpsAccuracyMeters: accuracyMeters,
    message: "You are within the planned route boundary.",
  };
}
