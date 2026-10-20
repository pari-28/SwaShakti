import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { LocationData } from "../types/location";
import { PlannedRoute } from "../types/route";
import {
  getNearestRiskArea,
  getCommunityAreaRisk,
  CommunityAreaRisk,
} from "../services/risk";
import { RouteRiskAnalysis } from "../services/routeRisk";

interface LiveMapProps {
  location: LocationData;
  plannedRoute?: PlannedRoute | null;
  routeRisk?: RouteRiskAnalysis | null;
  onRiskLocationChange?: (
    risk: CommunityAreaRisk | null
  ) => void;
}

interface RecenterMapProps {
  location: LocationData;
  hasPlannedRoute: boolean;
}

function RecenterMap({
  location,
  hasPlannedRoute,
}: RecenterMapProps) {
  const map = useMap();

  useEffect(() => {
    if (hasPlannedRoute) {
      return;
    }

    map.setView(
      [location.latitude, location.longitude],
      map.getZoom(),
      {
        animate: true,
      }
    );
  }, [
    location.latitude,
    location.longitude,
    hasPlannedRoute,
    map,
  ]);

  return null;
}

interface RouteViewProps {
  route: PlannedRoute | null | undefined;
}

function RouteView({ route }: RouteViewProps) {
  const map = useMap();

  useEffect(() => {
    if (!route || route.geometry.coordinates.length < 2) {
      return;
    }

    const bounds = route.geometry.coordinates.map(
      ([longitude, latitude]) =>
        [latitude, longitude] as [number, number]
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      animate: true,
    });
  }, [route, map]);

  return null;
}


export default function LiveMap({
  location,
  plannedRoute,
  routeRisk,
  onRiskLocationChange,
}: LiveMapProps) {
const [nearestRisk, setNearestRisk] =
  useState<CommunityAreaRisk | null>(null);

const [communityAreas, setCommunityAreas] = useState<
  CommunityAreaRisk[]
>([]);

const [loadingRisk, setLoadingRisk] = useState(true);
  const [riskError, setRiskError] = useState<string | null>(null);

  const [isAreaRiskExpanded, setIsAreaRiskExpanded] =
  useState(true);

  const [expandedRouteRiskAreas, setExpandedRouteRiskAreas] =
  useState<Set<string>>(new Set());

useEffect(() => {
  let cancelled = false;

  async function loadLocationRisk() {
    try {
      setLoadingRisk(true);
      setRiskError(null);

      const data = await getNearestRiskArea(
        location.latitude,
        location.longitude
      );

      if (!cancelled) {
        setNearestRisk(data);

        onRiskLocationChange?.(data);

        if (!data) {
          setRiskError(
            "No nearby risk data available for this area."
          );
        }
      }
    } catch (error) {
      if (!cancelled) {
        console.error(
          "Failed to load nearby risk:",
          error
        );

        setNearestRisk(null);
        setRiskError(
          "Unable to load risk data for this area."
        );
      }
    } finally {
      if (!cancelled) {
        setLoadingRisk(false);
      }
    }
  }

  loadLocationRisk();

  return () => {
    cancelled = true;
  };
}, [
  location.latitude,
  location.longitude,
  onRiskLocationChange,
]);


    useEffect(() => {
  let cancelled = false;

  async function loadCommunityRisk() {
    try {
      const data = await getCommunityAreaRisk();

      if (!cancelled) {
        setCommunityAreas(data);
      }
    } catch (error) {
      console.error(
        "Failed to load community area risk:",
        error
      );
    }
  }

  loadCommunityRisk();

  return () => {
    cancelled = true;
  };
}, []);

const getRiskStyles = () => {
  const activeRisk = nearestRisk;

  if (!activeRisk) {
      return {
        background: "#f8fafc",
        border: "#e2e8f0",
        text: "#475569",
      };
    }

    if (activeRisk.riskLevel === "HIGH") {
      return {
        background: "#fef2f2",
        border: "#fecaca",
        text: "#b91c1c",
      };
    }

    if (activeRisk.riskLevel === "MEDIUM") {
      return {
        background: "#fffbeb",
        border: "#fde68a",
        text: "#b45309",
      };
    }

    return {
      background: "#ecfdf5",
      border: "#a7f3d0",
      text: "#047857",
    };
  };

  const riskStyles = getRiskStyles();

  const activeRisk = nearestRisk;

const activeRiskLocation =
  nearestRisk?.location ?? null;

const activeRiskSource =
  nearestRisk?.dataSource ?? null;

  return (
    <div
      style={{
        position: "relative",
        height: "380px",
        width: "100%",
      }}
    >
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={16}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap
  location={location}
  hasPlannedRoute={Boolean(plannedRoute)}
/>

<RouteView route={plannedRoute} />

        <Marker
          position={[
            location.latitude,
            location.longitude,
          ]}
        >
          <Popup>
            <strong>You are here 📍</strong>
            <br />
            Live GPS location
          </Popup>
        </Marker>

        {plannedRoute && (
  <Polyline
    positions={plannedRoute.geometry.coordinates.map(
      ([longitude, latitude]) =>
        [latitude, longitude] as [number, number]
    )}
    pathOptions={{
      color: "#6C3EFF",
      weight: 6,
      opacity: 0.85,
    }}
  />
)}

{plannedRoute && (
  <Marker
    position={[
      plannedRoute.destination.latitude,
      plannedRoute.destination.longitude,
    ]}
  >
    <Popup>
      <strong>Destination 🎯</strong>
      <br />
      Planned route destination
    </Popup>
  </Marker>
)}

        {communityAreas
  .filter(
    (area) =>
      area.latitude !== null &&
      area.longitude !== null
  )
  .map((area) => {
    const riskColor =
      area.riskLevel === "HIGH"
        ? "#ef4444"
        : area.riskLevel === "MEDIUM"
        ? "#f59e0b"
        : "#10b981";

    return (
      <Circle
        key={`${area.location}-${area.latitude}-${area.longitude}`}
        center={[area.latitude!, area.longitude!]}
        radius={
          area.riskLevel === "HIGH"
            ? 700
            : area.riskLevel === "MEDIUM"
            ? 500
            : 350
        }
        pathOptions={{
          color: riskColor,
          fillColor: riskColor,
          fillOpacity: 0.22,
          weight: 2,
        }}
      >
        <Popup>
  <strong>{area.location}</strong>
  <br />

  {area.city && (
    <>
      City: {area.city}
      <br />
    </>
  )}

  Risk: {area.riskLevel}
  <br />

  Score: {area.riskScore}
  <br />

  Total Incidents: {area.incidentCount}
  <br />

  Public Reference: {area.publicReferenceIncidentCount}
  <br />

  SwaShakti Reports: {area.communityReportCount}
  <br />

  Source:{" "}
  {area.dataSource === "PUBLIC_REFERENCE_DATA"
    ? "Public Reference Data"
    : area.dataSource === "COMMUNITY_REPORT"
    ? "SwaShakti Community Reports"
    : "Combined"}
</Popup>
      </Circle>
    );
  })}

        {/* Route-relevant risk areas */}
      {routeRisk?.riskAreas.map((area) => {
        const riskColor =
          area.riskLevel === "HIGH"
            ? "#ef4444"
            : area.riskLevel === "MEDIUM"
            ? "#f59e0b"
            : "#10b981";

        return (
          <Circle
            key={`route-risk-${area.location}-${area.latitude}-${area.longitude}`}
            center={[area.latitude, area.longitude]}
            radius={900}
            pathOptions={{
              color: riskColor,
              weight: 5,
              opacity: 1,
              fillColor: riskColor,
              fillOpacity: 0.18,
              dashArray: "10 8",
            }}
          >
            <Popup>
              <strong>⚠️ Route Risk Area</strong>
              <br />
              <br />

              <strong>{area.location}</strong>
              <br />

              {area.city && (
                <>
                  City: {area.city}
                  <br />
                </>
              )}

              Risk: <strong>{area.riskLevel}</strong>
              <br />

              Risk Score: <strong>{area.riskScore}</strong>
              <br />

              Incidents: <strong>{area.incidentCount}</strong>
              <br />

              Distance from route:{" "}
              <strong>
                {area.distanceFromRouteKm.toFixed(2)} km
              </strong>
              <br />

              {area.categories.length > 0 && (
  <>
    <br />

    <div>
      <strong>Categories:</strong>
    </div>

    <div style={{ marginTop: "4px" }}>
      {(expandedRouteRiskAreas.has(
        `${area.location}-${area.latitude}-${area.longitude}`
      )
        ? area.categories
        : area.categories.slice(0, 3)
      ).map((category) => (
        <div key={category.category}>
          • {category.category} ({category.count})
        </div>
      ))}
    </div>

    {area.categories.length > 3 && (
      <button
        type="button"
        onClick={() => {
          const key = `${area.location}-${area.latitude}-${area.longitude}`;

          setExpandedRouteRiskAreas((previous) => {
            const next = new Set(previous);

            if (next.has(key)) {
              next.delete(key);
            } else {
              next.add(key);
            }

            return next;
          });
        }}
        style={{
          marginTop: "6px",
          border: "none",
          background: "transparent",
          padding: 0,
          color: "#6C3EFF",
          fontSize: "12px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {expandedRouteRiskAreas.has(
          `${area.location}-${area.latitude}-${area.longitude}`
        )
          ? "− Show less"
          : `+ View all ${area.categories.length} categories`}
      </button>
    )}
  </>
)}
            </Popup>
          </Circle>
        );
      })}
  
      </MapContainer>

      {/* City Risk Card */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 1000,
          minWidth: "210px",
          padding: "14px 16px",
          borderRadius: "16px",
          background: "white",
          border: `1px solid ${riskStyles.border}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}
      >
        <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isAreaRiskExpanded ? "8px" : "0",
  }}
>
  <div
    style={{
      fontSize: "11px",
      fontWeight: 700,
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    Area Risk
  </div>

  <button
    type="button"
    onClick={() =>
      setIsAreaRiskExpanded((previous) => !previous)
    }
    aria-label={
      isAreaRiskExpanded
        ? "Collapse area risk"
        : "Expand area risk"
    }
    style={{
      width: "24px",
      height: "24px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      color: "#475569",
      fontSize: "16px",
      fontWeight: 800,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
    }}
  >
    {isAreaRiskExpanded ? "−" : "+"}
  </button>
</div>
{isAreaRiskExpanded && (
  <>

        {loadingRisk && (
  <div
    style={{
      fontSize: "13px",
      color: "#64748b",
    }}
  >
    Loading risk data...
  </div>
)}

{!loadingRisk && !activeRisk && (
  <div
    style={{
      fontSize: "13px",
      color: "#64748b",
      lineHeight: 1.5,
    }}
  >
    No risk data available for this area.
  </div>

)}

{!loadingRisk && activeRisk && (
  <>
    <div
      style={{
        fontSize: "17px",
        fontWeight: 800,
        color: "#0f172a",
      }}
    >
      {activeRiskLocation}
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "7px",
      }}
    >
      <span
        style={{
          padding: "4px 9px",
          borderRadius: "999px",
          background: riskStyles.background,
          border: `1px solid ${riskStyles.border}`,
          color: riskStyles.text,
          fontSize: "10px",
          fontWeight: 800,
        }}
      >
        {activeRisk.riskLevel}
      </span>

      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#334155",
        }}
      >
        Score {activeRisk.riskScore}
      </span>
    </div>

    <div
      style={{
        marginTop: "8px",
        fontSize: "11px",
        color: "#64748b",
      }}
    >
      {activeRisk.incidentCount.toLocaleString()} incidents
    </div>

    {activeRiskSource && (
      <div
        style={{
          marginTop: "5px",
          fontSize: "10px",
          fontWeight: 700,
          color: "#7c3aed",
        }}
      >
        Source:{" "}
        {activeRiskSource === "COMMUNITY_REPORT"
          ? "SwaShakti Community Reports"
          : activeRiskSource === "COMBINED"
          ? "Combined Data"
          : "Public Reference Data"}
      </div>
    )}
  </>
)}
 </>
)}
      </div>

    </div>
    
  );
}