
import { useState } from "react";
import {
  LoaderCircle,
  MapPin,
  Navigation,
  Route as RouteIcon,
  X,
  LocateFixed,
} from "lucide-react";

import { LocationData } from "../types/location";
import { PlannedRoute } from "../types/route";
import {
  GeocodedLocation,
  searchLocation,
} from "../services/locationSearch";
import { getRoute } from "../services/routing";

interface RoutePlannerProps {
  location: LocationData | null;
  onRoutePlanned?: (route: PlannedRoute) => void;
  onRouteCleared?: () => void;
}

function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function formatDuration(durationSeconds: number): string {
  const totalMinutes = Math.round(durationSeconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes === 0
    ? `${hours} hr`
    : `${hours} hr ${minutes} min`;
}

export default function RoutePlanner({
  location,
  onRoutePlanned,
  onRouteCleared,
}: RoutePlannerProps) {
  const [startQuery, setStartQuery] = useState("");
  const [destination, setDestination] = useState("");

  const [startCandidates, setStartCandidates] =
    useState<GeocodedLocation[]>([]);
  const [destinationCandidates, setDestinationCandidates] =
    useState<GeocodedLocation[]>([]);

  const [selectedStart, setSelectedStart] =
    useState<GeocodedLocation | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<GeocodedLocation | null>(null);

  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchingStart, setSearchingStart] = useState(false);
  const [searchingDestination, setSearchingDestination] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasCurrentLocation =
    location !== null &&
    location !== undefined &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude);

  function clearPlannedRoute() {
    setRoute(null);
    onRouteCleared?.();
  }

  async function handleSearchStart() {
    const query = startQuery.trim();

    if (!query) {
      setError("Enter a starting location to search.");
      return;
    }

    try {
      setSearchingStart(true);
      setError(null);
      setStartCandidates([]);
      setSelectedStart(null);
      setUseCurrentLocation(false);
      clearPlannedRoute();

      const results = await searchLocation(query);

      setStartCandidates(results);

      if (results.length === 1) {
        setSelectedStart(results[0]);
      }

      if (results.length === 0) {
        setError("No starting locations were found. Try another search.");
      }
    } catch (err) {
      console.error("Starting location search failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to find the starting location."
      );
    } finally {
      setSearchingStart(false);
    }
  }

  async function handleSearchDestination() {
    const query = destination.trim();

    if (!query) {
      setError("Please enter a destination.");
      return;
    }

    try {
      setSearchingDestination(true);
      setError(null);
      setDestinationCandidates([]);
      setSelectedDestination(null);
      clearPlannedRoute();

      const results = await searchLocation(query);

      setDestinationCandidates(results);

      if (results.length === 1) {
        setSelectedDestination(results[0]);
      }

      if (results.length === 0) {
        setError("No destinations were found. Try another search.");
      }
    } catch (err) {
      console.error("Destination search failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to find this destination."
      );
    } finally {
      setSearchingDestination(false);
    }
  }

  function handleUseCurrentLocation() {
    setUseCurrentLocation(true);
    setStartQuery("");
    setStartCandidates([]);
    setSelectedStart(null);
    setError(null);
    clearPlannedRoute();
  }

  function handleUseCustomStart() {
    setUseCurrentLocation(false);
    setStartQuery("");
    setStartCandidates([]);
    setSelectedStart(null);
    setError(null);
    clearPlannedRoute();
  }

  async function handlePlanRoute() {
    if (!selectedDestination) {
      setError(
        "Search for a destination and select the correct result first."
      );
      return;
    }

    let startCoordinates: {
      latitude: number;
      longitude: number;
    };

    if (useCurrentLocation) {
      if (!hasCurrentLocation) {
        setError(
          "Your GPS location is unavailable. Choose a different starting location or wait for GPS."
        );
        return;
      }

      startCoordinates = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    } else {
      if (!selectedStart) {
        setError(
          "Search for a starting location and select the correct result."
        );
        return;
      }

      startCoordinates = {
        latitude: selectedStart.latitude,
        longitude: selectedStart.longitude,
      };
    }

    try {
      setLoading(true);
      setError(null);
      setRoute(null);

      const plannedRoute = await getRoute(startCoordinates, {
        latitude: selectedDestination.latitude,
        longitude: selectedDestination.longitude,
      });

      setRoute(plannedRoute);
      onRoutePlanned?.(plannedRoute);
    } catch (err) {
      console.error("Route planning failed:", err);

      setRoute(null);
      onRouteCleared?.();

      setError(
        err instanceof Error
          ? err.message
          : "Unable to plan the route."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClearRoute() {
    setStartQuery("");
    setDestination("");
    setStartCandidates([]);
    setDestinationCandidates([]);
    setSelectedStart(null);
    setSelectedDestination(null);
    setUseCurrentLocation(true);
    setRoute(null);
    setError(null);
    onRouteCleared?.();
  }

  function renderCandidates(
    candidates: GeocodedLocation[],
    selected: GeocodedLocation | null,
    onSelect: (candidate: GeocodedLocation) => void
  ) {
    return (
      <div className="mt-3 space-y-2">
        {candidates.map((candidate, index) => {
          const isSelected =
            selected?.latitude === candidate.latitude &&
            selected?.longitude === candidate.longitude;

          return (
            <button
              key={`${candidate.latitude}-${candidate.longitude}`}
              type="button"
              onClick={() => {
                onSelect(candidate);
                setError(null);
                clearPlannedRoute();
              }}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                isSelected
                  ? "border-[#6C3EFF] bg-[#6C3EFF]/5"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <MapPin
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  isSelected ? "text-[#6C3EFF]" : "text-slate-400"
                }`}
              />

              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-800">
                  {candidate.displayName}
                </span>

                <span className="mt-1 block text-[11px] text-slate-500">
                  {candidate.city ||
                    candidate.district ||
                    candidate.state ||
                    "Location result"}{" "}
                  · {candidate.latitude.toFixed(5)},{" "}
                  {candidate.longitude.toFixed(5)}
                </span>
              </span>

              <span className="shrink-0 text-[11px] text-slate-500">
                {isSelected ? "Selected" : `Option ${index + 1}`}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C3EFF]/10">
          <Navigation className="h-4 w-4 text-[#6C3EFF]" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Plan Your Route
          </h3>
          <p className="text-xs text-slate-500">
            Choose a starting point and destination.
          </p>
        </div>
      </div>

      {/* Starting location */}
      <div className="mb-4 rounded-xl border border-slate-200 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-700">
            Starting location
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleUseCustomStart}
              disabled={!useCurrentLocation || loading}
              className="text-xs font-semibold text-[#6C3EFF] disabled:cursor-default disabled:text-slate-400"
            >
              Enter a different location
            </button>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={useCurrentLocation || loading}
              className="flex items-center gap-1 text-xs font-semibold text-[#6C3EFF] disabled:cursor-default disabled:text-emerald-600"
            >
              <LocateFixed className="h-3.5 w-3.5" />
              {useCurrentLocation ? "Using GPS" : "Use my GPS"}
            </button>
          </div>
        </div>

        {useCurrentLocation ? (
          <div
            className={`rounded-lg px-3 py-2 text-xs ${
              hasCurrentLocation
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <MapPin className="mr-1 inline h-3.5 w-3.5" />

            {hasCurrentLocation
              ? `Current GPS coordinates: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
              : "GPS location is not available yet. You can enter a different starting location."}
          </div>
        ) : (
          <>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();

                if (!searchingStart && !loading) {
                  handleSearchStart();
                }
              }}
            >
              <input
                type="text"
                value={startQuery}
                onChange={(event) => {
                  setStartQuery(event.target.value);
                  setStartCandidates([]);
                  setSelectedStart(null);
                  setError(null);
                  clearPlannedRoute();
                }}
                placeholder="Search starting location..."
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#6C3EFF] focus:ring-2 focus:ring-[#6C3EFF]/10"
              />

              <button
                type="submit"
                disabled={searchingStart || loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#6C3EFF] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searchingStart ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {searchingStart ? "Searching..." : "Find Start"}
              </button>
            </form>

            {renderCandidates(
              startCandidates,
              selectedStart,
              setSelectedStart
            )}
          </>
        )}
      </div>

      {/* Destination */}
      <div className="rounded-xl border border-slate-200 p-3">
        <p className="mb-2 text-xs font-semibold text-slate-700">
          Destination
        </p>

        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();

            if (!searchingDestination && !loading) {
              handleSearchDestination();
            }
          }}
        >
          <div className="relative min-w-0 flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={destination}
              onChange={(event) => {
                setDestination(event.target.value);
                setDestinationCandidates([]);
                setSelectedDestination(null);
                setError(null);
                clearPlannedRoute();
              }}
              placeholder="Enter destination..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-[#6C3EFF] focus:ring-2 focus:ring-[#6C3EFF]/10"
            />
          </div>

          <button
            type="submit"
            disabled={searchingDestination || loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#6C3EFF] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searchingDestination ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            {searchingDestination ? "Searching..." : "Find Destination"}
          </button>
        </form>

        {renderCandidates(
          destinationCandidates,
          selectedDestination,
          setSelectedDestination
        )}
      </div>

      {/* Plan route */}
      <button
        type="button"
        onClick={handlePlanRoute}
        disabled={
          loading ||
          searchingStart ||
          searchingDestination ||
          !selectedDestination ||
          (useCurrentLocation
            ? !hasCurrentLocation
            : !selectedStart)
        }
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C3EFF] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5a2fe0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Planning Route...
          </>
        ) : (
          <>
            <RouteIcon className="h-4 w-4" />
            Plan Route
          </>
        )}
      </button>

      {error && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
        >
          {error}
        </div>
      )}

      {/* Route summary */}
      {route && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Route Ready
              </p>

              <p className="mt-2 break-words text-xs text-slate-600">
                <strong>From:</strong>{" "}
                {useCurrentLocation
                  ? "Current GPS location"
                  : selectedStart?.displayName}
              </p>

              <p className="mt-1 break-words text-xs text-slate-600">
                <strong>To:</strong>{" "}
                {selectedDestination?.displayName}
              </p>

              <div className="mt-3 flex flex-wrap gap-4">
                <div>
                  <p className="text-[11px] text-slate-500">
                    Distance
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {formatDistance(route.distanceMeters)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">
                    Estimated time
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {formatDuration(route.durationSeconds)}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearRoute}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
              aria-label="Clear route"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
