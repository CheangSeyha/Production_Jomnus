"use client";
 
import { useEffect, useState, useCallback } from "react";
import { LocateFixed, MapPin, Search, X } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";

type LatLng = [number, number];
 
type Props = {
  lat?: number;
  lng?: number;
};
 
type RouteInfo = {
  polyline: LatLng[];
  distanceKm: number;
  durationMin: number;
};

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    country?: string;
  };
};

type SearchSuggestion = {
  id: number;
  label: string;
  detail: string;
  pos: LatLng;
};

const CAMBODIA_VIEWBOX = "102.333828,10.400000,107.627724,14.690422";

const SEARCH_ALIASES: Record<string, string> = {
  rupp: "Royal University of Phnom Penh",
  "royal university phnom penh": "Royal University of Phnom Penh",
};

const makeIcon = (color: string, label: string) =>
  L.divIcon({
    className: "",
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <div style="
          background:${color};
          color:#fff;
          font-size:10px;
          font-weight:700;
          font-family:system-ui,sans-serif;
          letter-spacing:0.05em;
          padding:3px 7px;
          border-radius:20px;
          white-space:nowrap;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
        ">${label}</div>
        <div style="
          width:14px;height:14px;
          background:${color};
          border:2.5px solid #fff;
          border-radius:50%;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
        <div style="
          width:2px;height:16px;
          background:${color};
          opacity:0.7;
          border-radius:2px;
        "></div>
      </div>
    `,
    iconSize: [36, 52],
  });
 
const TASK_ICON   = makeIcon("#0ea5e9", "Task");   // sky
const USER_ICON   = makeIcon("#10b981", "You");    // emerald
const SEARCH_ICON = makeIcon("#d946ef", "Search"); // fuchsia
 
function FlyTo({ pos, zoom = 14 }: { pos: LatLng; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(pos, zoom, { duration: 1.4 });
  }, [pos, zoom, map]);
  return null;
}

function FitBounds({ positions }: { positions: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length < 2) return;
    const bounds = L.latLngBounds(positions.map(([a, b]) => [a, b]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
  }, [positions, map]);
  return null;
}

function haversineKm([lat1, lon1]: LatLng, [lat2, lon2]: LatLng): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchRoute(from: LatLng, to: LatLng): Promise<RouteInfo | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from[1]},${from[0]};${to[1]},${to[0]}` +
      `?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.code !== "Ok" || !json.routes?.[0]) return null;
    const route = json.routes[0];
    const coords: LatLng[] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    return {
      polyline: coords,
      distanceKm: route.distance / 1000,
      durationMin: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}

function normalizeSearchQuery(query: string) {
  const normalized = query.trim().toLowerCase();
  return SEARCH_ALIASES[normalized] ?? query.trim();
}

function formatSuggestion(result: SearchResult): SearchSuggestion {
  const parts = result.display_name.split(",").map((part) => part.trim());
  const label = parts[0] || result.display_name;
  const city =
    result.address?.city ||
    result.address?.town ||
    result.address?.village ||
    result.address?.suburb;
  const detail = [city, result.address?.country || "Cambodia"]
    .filter(Boolean)
    .join(", ");

  return {
    id: result.place_id,
    label,
    detail: detail || parts.slice(1, 4).join(", "),
    pos: [parseFloat(result.lat), parseFloat(result.lon)],
  };
}

async function geocodeSuggestions(query: string): Promise<SearchSuggestion[]> {
  try {
    const focusedQuery = normalizeSearchQuery(query);
    const params = new URLSearchParams({
      q: focusedQuery,
      format: "json",
      limit: "5",
      addressdetails: "1",
      countrycodes: "kh",
      viewbox: CAMBODIA_VIEWBOX,
      bounded: "1",
    });
    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    const json: SearchResult[] = await res.json();
    return json.map(formatSuggestion);
  } catch {
    return [];
  }
}

export default function SharedTaskMap({ lat, lng }: Props) {
  const taskPos: LatLng | null = lat && lng ? [lat, lng] : null;
 
  const [userPos, setUserPos]         = useState<LatLng | null>(null);
  const [searchPos, setSearchPos]     = useState<LatLng | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [route, setRoute]             = useState<RouteInfo | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [searchRoute, setSearchRoute] = useState<RouteInfo | null>(null);
  const [searchRouteLoading, setSearchRouteLoading] = useState(false);
  const [geoLoading, setGeoLoading]   = useState(false);
  const [flyTarget, setFlyTarget]     = useState<LatLng | null>(taskPos);
  const [fitPositions, setFitPositions] = useState<LatLng[]>([]);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    setGeoLoading(true);
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        const pos: LatLng = [coords.latitude, coords.longitude];
        setUserPos(pos);
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    const origin = userPos;
    const dest   = taskPos;
    if (!origin || !dest) { setRoute(null); return; }
 
    setRouteLoading(true);
    fetchRoute(origin, dest).then((r) => {
      setRoute(r);
      setRouteLoading(false);
      // Fit map to show both markers + route
      const pts: LatLng[] = r ? r.polyline : [origin, dest];
      setFitPositions(pts);
      setFlyTarget(null);
    });
  }, [userPos, lat, lng]);

  useEffect(() => {
    const origin = searchPos;
    const dest = taskPos;
    if (!origin || !dest) {
      setSearchRoute(null);
      setSearchRouteLoading(false);
      return;
    }

    setSearchRouteLoading(true);
    fetchRoute(origin, dest).then((r) => {
      setSearchRoute(r);
      setSearchRouteLoading(false);
      const pts: LatLng[] = r ? r.polyline : [origin, dest];
      setFitPositions(pts);
      setFlyTarget(null);
    });
  }, [searchPos, lat, lng]);
 
  // Handle search submit
  const handleSearch = useCallback(async () => {
    const q = searchInput.trim();
    if (!q) return;
    setIsSearching(true);
    setSearchError("");
    setSearchSuggestions([]);
    const suggestions = await geocodeSuggestions(q);
    setIsSearching(false);
    if (suggestions.length === 0) {
      setSearchError("No Cambodia results found. Try the full place name or nearby area.");
      return;
    }
    setSearchSuggestions(suggestions);
    if (suggestions.length === 1) {
      const [suggestion] = suggestions;
      setSearchInput(suggestion.label);
      setSearchPos(suggestion.pos);
      setFlyTarget(suggestion.pos);
      setFitPositions(taskPos ? [suggestion.pos, taskPos] : []);
      setSearchSuggestions([]);
    }
  }, [searchInput, taskPos]);

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setSearchInput(suggestion.label);
    setSearchPos(suggestion.pos);
    setFlyTarget(suggestion.pos);
    setFitPositions(taskPos ? [suggestion.pos, taskPos] : []);
    setSearchError("");
    setSearchSuggestions([]);
  };
 
  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const distanceKm = route
    ? route.distanceKm
    : userPos && taskPos
    ? haversineKm(userPos, taskPos)
    : null;

  const searchDistanceKm = searchRoute
    ? searchRoute.distanceKm
    : searchPos && taskPos
    ? haversineKm(searchPos, taskPos)
    : null;
 
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-sky-50">

      <MapContainer
        center={taskPos ?? [11.5564, 104.9282]}
        zoom={12}
        className="h-full w-full z-0"
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        {flyTarget && <FlyTo pos={flyTarget} />}
        {fitPositions.length >= 2 && <FitBounds positions={fitPositions} />}

        {taskPos && (
          <Marker position={taskPos} icon={TASK_ICON}>
            <Popup className="text-xs font-semibold">📍 Task Location</Popup>
          </Marker>
        )}

        {userPos && (
          <Marker position={userPos} icon={USER_ICON}>
            <Popup className="text-xs font-semibold">🧑 Your Location</Popup>
          </Marker>
        )}

        {searchPos && (
          <Marker position={searchPos} icon={SEARCH_ICON}>
            <Popup className="text-xs font-semibold">🔍 {searchInput}</Popup>
          </Marker>
        )}
 
        {/* Route polyline */}
        {route && (
          <>
            <Polyline
              positions={route.polyline}
              pathOptions={{ color: "#0f172a", weight: 8, opacity: 0.18 }}
            />
            <Polyline
              positions={route.polyline}
              pathOptions={{
                color: "#0ea5e9",
                weight: 5,
                opacity: 0.95,
                dashArray: undefined,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {!route && userPos && taskPos && (
          <Polyline
            positions={[userPos, taskPos]}
            pathOptions={{
              color: "#0ea5e9",
              weight: 3,
              opacity: 0.8,
              dashArray: "6 6",
            }}
          />
        )}

        {searchRoute && (
          <>
            <Polyline
              positions={searchRoute.polyline}
              pathOptions={{ color: "#0f172a", weight: 8, opacity: 0.16 }}
            />
            <Polyline
              positions={searchRoute.polyline}
              pathOptions={{
                color: "#d946ef",
                weight: 5,
                opacity: 0.95,
                dashArray: "10 8",
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {!searchRoute && searchPos && taskPos && (
          <Polyline
            positions={[searchPos, taskPos]}
            pathOptions={{
              color: "#d946ef",
              weight: 3,
              opacity: 0.8,
              dashArray: "6 6",
            }}
          />
        )}
      </MapContainer>

      <div className="absolute top-3 left-3 right-3 z-[1000] rounded-2xl border border-sky-200 bg-white/95 p-2 shadow-[0_16px_45px_rgba(15,23,42,0.22)] backdrop-blur-md">
        <div className="mb-2 flex items-center gap-2 px-1">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
            <LocateFixed size={16} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-700">Find on map</p>
            <p className="text-[11px] font-medium text-slate-500">Search is separate from task filters</p>
          </div>
        </div>
        <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder="Search a location…"
            className="w-full rounded-xl border border-sky-200 bg-sky-50 py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 placeholder-slate-500 shadow-inner shadow-sky-100/60 transition focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-200/80"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearchPos(null);
                setSearchRoute(null);
                setSearchError("");
                setSearchSuggestions([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>
 
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchInput.trim()}
          className="rounded-xl border border-sky-600 bg-sky-600 px-4 py-3 text-sm font-black text-white shadow-sm shadow-sky-200 transition-all duration-150 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 whitespace-nowrap"
        >
          {isSearching ? "…" : "Search"}
        </button>
        </div>

        {searchSuggestions.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-sky-100 bg-white shadow-sm">
            {searchSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className="flex w-full items-start gap-2 border-b border-slate-100 px-3 py-2.5 text-left transition last:border-b-0 hover:bg-sky-50"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-sky-500" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-black text-slate-800">
                    {suggestion.label}
                  </span>
                  <span className="block truncate text-[11px] font-medium text-slate-500">
                    {suggestion.detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
 
      {searchError && (
        <div className="absolute top-[118px] left-3 right-3 z-[1000]">
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs text-rose-700 font-bold shadow-sm">
            {searchError}
          </div>
        </div>
      )}
 
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none sm:right-auto">
 
        {/* Distance + duration */}
        {distanceKm !== null && (
          <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-2 rounded-xl border border-sky-200 bg-white/95 px-3 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-xs font-bold text-slate-600">You to task</span>
            <span className="text-xs font-black text-slate-800">
              {distanceKm < 1
                ? `${Math.round(distanceKm * 1000)} m`
                : `${distanceKm.toFixed(1)} km`}
            </span>
            {route && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-600">{route.durationMin} min by road</span>
              </>
            )}
            {!route && userPos && taskPos && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-500 italic">straight line</span>
              </>
            )}
          </div>
        )}

        {searchDistanceKm !== null && (
          <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-2 rounded-xl border border-fuchsia-200 bg-white/95 px-3 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
            <span className="text-xs font-bold text-slate-600">Search to task</span>
            <span className="text-xs font-black text-slate-800">
              {searchDistanceKm < 1
                ? `${Math.round(searchDistanceKm * 1000)} m`
                : `${searchDistanceKm.toFixed(1)} km`}
            </span>
            {searchRoute && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-600">{searchRoute.durationMin} min by road</span>
              </>
            )}
            {!searchRoute && searchPos && taskPos && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-500 italic">straight line</span>
              </>
            )}
          </div>
        )}
 
        {/* Legend */}
        <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-3 rounded-xl border border-sky-200 bg-white/95 px-3 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.18)] backdrop-blur-sm">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Task
          </span>
          {userPos && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> You
            </span>
          )}
          {searchPos && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" /> Search
            </span>
          )}
          {routeLoading && (
            <span className="text-xs font-semibold text-slate-500 italic">routing you…</span>
          )}
          {searchRouteLoading && (
            <span className="text-xs font-semibold text-slate-500 italic">routing search…</span>
          )}
          {geoLoading && (
            <span className="text-xs font-semibold text-slate-500 italic">locating you…</span>
          )}
        </div>
      </div>
    </div>
  );
}
