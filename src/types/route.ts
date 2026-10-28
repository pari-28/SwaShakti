export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RouteGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

export interface PlannedRoute {
  start: RouteCoordinate;
  destination: RouteCoordinate;
  distanceMeters: number;
  durationSeconds: number;
  geometry: RouteGeometry;

  // Actual road-connected point used to begin the route.
  roadStart?: RouteCoordinate;

  // Distance between the requested start and the mapped road.
  startSnapDistanceMeters?: number;
}