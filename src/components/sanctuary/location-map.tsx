import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LocateFixed, Navigation, Route } from "lucide-react";
import { mapDestinationQuery, type MapDestination } from "./site-settings";
import { useI18n } from "@/i18n";

type LatLng = { lat: number; lng: number };

function destinationPin(L: typeof import("leaflet")) {
  return L.divIcon({
    className: "location-map-pin",
    html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:#52a1fe;border:2px solid #083a75;box-shadow:0 2px 8px rgba(8,58,117,.35)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

async function fetchRoute(from: LatLng, to: LatLng): Promise<[number, number][]> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ];
  }
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("route failed");
    const json = (await res.json()) as {
      routes?: { geometry?: { coordinates?: [number, number][] } }[];
    };
    const coords = json.routes?.[0]?.geometry?.coordinates;
    if (!coords?.length) throw new Error("empty");
    // GeoJSON is [lng, lat] → Leaflet wants [lat, lng]
    return coords.map(([lng, lat]) => [lat, lng]);
  } catch {
    return [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ];
  }
}

export function LocationMap() {
  const { t, lang } = useI18n();
  const { data: destination = null } = useQuery(mapDestinationQuery);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [here, setHere] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "ready" | "denied" | "error">("idle");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current || !destination) return;
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !mapEl.current) return;

      const pin = destinationPin(L);

      const map = L.map(mapEl.current, { scrollWheelZoom: false }).setView(
        [destination.lat, destination.lng],
        13,
      );
      // Tiles need network when available; map still mounts offline with destination pin.
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const layers = L.layerGroup().addTo(map);
      mapRef.current = map;
      layerRef.current = layers;

      const label = lang === "fr" ? destination.label_fr : destination.label_en;
      L.marker([destination.lat, destination.lng], { icon: pin }).addTo(layers).bindPopup(label);

      setTimeout(() => map.invalidateSize(), 80);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [destination, lang]);

  useEffect(() => {
    if (!destination || !mapRef.current || !layerRef.current || !here) return;
    let cancelled = false;

    void (async () => {
      const L = await import("leaflet");
      const map = mapRef.current;
      const layers = layerRef.current;
      if (!map || !layers || cancelled) return;

      layers.clearLayers();

      const destLabel = lang === "fr" ? destination.label_fr : destination.label_en;

      L.marker([destination.lat, destination.lng], { icon: destinationPin(L) })
        .addTo(layers)
        .bindPopup(destLabel);
      L.circleMarker([here.lat, here.lng], {
        radius: 8,
        color: "#083a75",
        fillColor: "#52a1fe",
        fillOpacity: 0.95,
        weight: 2,
      })
        .addTo(layers)
        .bindPopup(t.locations.mapYouAreHere);

      const line = await fetchRoute(here, destination);
      if (cancelled) return;

      const poly = L.polyline(line, {
        color: "#2b78dc",
        weight: 5,
        opacity: 0.9,
        lineJoin: "round",
      }).addTo(layers);

      map.fitBounds(poly.getBounds().pad(0.18));

      const R = 6371;
      const dLat = ((destination.lat - here.lat) * Math.PI) / 180;
      const dLng = ((destination.lng - here.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((here.lat * Math.PI) / 180) *
          Math.cos((destination.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      setDistanceKm(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    })();

    return () => {
      cancelled = true;
    };
  }, [here, destination, lang, t.locations.mapYouAreHere]);

  function locate() {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30_000 },
    );
  }

  useEffect(() => {
    if (!destination || status !== "idle") return;
    locate();
    // Auto-request once destination is known; user can retry via the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  const destLabel = destination ? (lang === "fr" ? destination.label_fr : destination.label_en) : "";

  return (
    <section className="location-map band band-snow" id="map" data-scroll>
      <div className="section-head">
        <p className="kicker">{t.locations.mapTitle}</p>
        <h2 className="display-lg">{t.locations.mapHeading}</h2>
        <p className="serif-lead">{t.locations.mapLead}</p>
      </div>

      <div className="location-map-shell">
        <div className="location-map-toolbar">
          <button type="button" className="pill" onClick={locate} disabled={status === "locating"}>
            <LocateFixed className="h-4 w-4" />
            {status === "locating" ? t.locations.mapLocating : t.locations.mapUseLocation}
          </button>
          {destination && (
            <a
              className="pill pill-ink"
              href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${here ? `${here.lat}%2C${here.lng}` : ""}%3B${destination.lat}%2C${destination.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" />
              {t.locations.mapOpenDirections}
            </a>
          )}
        </div>

        <div ref={mapEl} className="location-map-canvas" role="img" aria-label={t.locations.mapHeading} />

        <div className="location-map-meta">
          <p>
            <Route className="inline h-4 w-4" /> {t.locations.mapDestination}: <strong>{destLabel}</strong>
          </p>
          {distanceKm != null && (
            <p>
              {t.locations.mapDistance}: <strong>{distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}</strong>
            </p>
          )}
          {status === "denied" && <p className="form-error">{t.locations.mapDenied}</p>}
          {status === "error" && <p className="form-error">{t.locations.mapUnavailable}</p>}
          {status === "idle" && <p className="empty-note">{t.locations.mapHint}</p>}
        </div>
      </div>
    </section>
  );
}
