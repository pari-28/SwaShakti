import { PlannedRoute, RouteCoordinate } from "../types/route";

const OSRM_BASE_URL = "https://router.project-osrm.org";


interface OSRMRouteResponse {
  code: string;
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
  `?overview=full` +
  `&geometries=geojson` +
  `&steps=false`;

  console.log("OSRM ROUTE URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to connect to the routing service.");
  }

  const data: OSRMRouteResponse = await response.json();




if (data.waypoints?.length === 2) {
  const startSnapDistance = data.waypoints[0].distance;
  const destinationSnapDistance = data.waypoints[1].distance;

  console.log("START ROAD SNAP DISTANCE:", startSnapDistance, "meters");
  console.log(
    "DESTINATION ROAD SNAP DISTANCE:",
    destinationSnapDistance,
    "meters"
  );

  const MAX_START_SNAP_DISTANCE = 50;
  const MAX_DESTINATION_SNAP_DISTANCE = 300;

  if (startSnapDistance > MAX_START_SNAP_DISTANCE) {
    throw new Error(
      `Starting point is too far from a road (${Math.round(startSnapDistance)} m). Please choose a nearby location.`
    );
  }

  if (destinationSnapDistance > MAX_DESTINATION_SNAP_DISTANCE) {
    throw new Error(
      `Destination is too far from a road (${Math.round(destinationSnapDistance)} m). Please select a more precise destination.`
    );
  }
}




  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("No route could be found for this destination.");
  }

  const route = data.routes[0];

  return {
    start,
    destination,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry: route.geometry,
  };
}