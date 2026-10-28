
import { PlannedRoute, RouteCoordinate } from "../types/route";

const OSRM_BASE_URL = "https://router.project-osrm.org";

// Configurable product threshold, not a guarantee of safety.
const MAX_START_SNAP_DISTANCE = 150;
const MAX_DESTINATION_SNAP_DISTANCE = 300;

interface OSRMRouteResponse {
  code: string;
  message?: string;
  routes?: {
    distance: number;
    duration: number;
    geometry: {
      type: "LineString";
      coordinates: [number, number][];
    };
  }[];
  waypoints?: {
    location: [number, number];
    distance: number;
  }[];
}

export async function getRoute(
  start: RouteCoordinate,
  destination: RouteCoordinate
): Promise<PlannedRoute> {
  const coordinates = [
    `${start.longitude},${start.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(";");

  const url =
    `${OSRM_BASE_URL}/route/v1/driving/${coordinates}` +
    `?overview=full&geometries=geojson&steps=false`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to connect to the routing service.");
  }

  const data: OSRMRouteResponse = await response.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(
      data.message || "No route could be found for this destination."
    );
  }

  if (data.waypoints?.length !== 2) {
    throw new Error(
      "The routing service could not confirm the road connection. Please try another location."
    );
  }

  const startWaypoint = data.waypoints[0];
  const destinationWaypoint = data.waypoints[1];

  const startSnapDistance = startWaypoint.distance;
  const destinationSnapDistance = destinationWaypoint.distance;

  console.log("START ROAD SNAP DISTANCE:", startSnapDistance, "meters");
  console.log(
    "DESTINATION ROAD SNAP DISTANCE:",
    destinationSnapDistance,
    "meters"
  );

  if (startSnapDistance > MAX_START_SNAP_DISTANCE) {
    throw new Error(
      `Your starting point is ${Math.round(startSnapDistance)} m from the nearest mapped road, exceeding the ${MAX_START_SNAP_DISTANCE} m limit. Select a closer starting point.`
    );
  }

  if (destinationSnapDistance > MAX_DESTINATION_SNAP_DISTANCE) {
    throw new Error(
      `Your destination is ${Math.round(destinationSnapDistance)} m from the nearest mapped road. Please select a more precise destination.`
    );
  }

  const route = data.routes[0];

  return {
    start,
    destination,
    roadStart: {
      longitude: startWaypoint.location[0],
      latitude: startWaypoint.location[1],
    },
    startSnapDistanceMeters: startSnapDistance,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: route.geometry,
  };
}
