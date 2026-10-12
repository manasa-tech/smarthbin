import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [12.9716, 77.5946];

function getCoordinates(bin) {
  const latitude = Number(
    bin.latitude ?? bin.lat ?? bin.location?.latitude
  );
  const longitude = Number(
    bin.longitude ?? bin.lng ?? bin.lon ?? bin.location?.longitude
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return [latitude, longitude];
}

function getFill(bin) {
  return Math.max(
    0,
    Math.min(100, Number(bin.fill_level ?? bin.fill_percentage ?? 0))
  );
}

function getColor(fill) {
  if (fill >= 90) return "#dc2626";
  if (fill >= 80) return "#f97316";
  if (fill >= 50) return "#eab308";
  return "#16a34a";
}

function createBinIcon(fill, selected) {
  const color = getColor(fill);

  return L.divIcon({
    className: "smartbin-route-marker",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${color};
        border: ${selected ? "4px solid #0f172a" : "3px solid white"};
        box-shadow: 0 3px 9px rgba(0,0,0,0.25);
        color: white;
        font-size: 11px;
        font-weight: 800;
      ">
        <span style="transform: rotate(45deg);">${Math.round(fill)}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

function MapViewport({ points }) {
  const map = useMap();

  useMemo(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [35, 35], maxZoom: 15 });
    }
  }, [map, points]);

  return null;
}

export default function RouteMap({
  bins = [],
  pickupSequence = [],
  selectedBinId = null,
  onBinClick,
  height = "480px",
}) {
  const validBins = useMemo(
    () =>
      bins
        .map((bin) => ({
          ...bin,
          coordinates: getCoordinates(bin),
        }))
        .filter((bin) => bin.coordinates),
    [bins]
  );

  const routePoints = useMemo(() => {
    const orderedBins = pickupSequence
      .map((item) => {
        if (typeof item === "object") return item;

        return bins.find(
          (bin) =>
            String(bin.id ?? bin.bin_id) === String(item)
        );
      })
      .filter(Boolean);

    const source = orderedBins.length > 0 ? orderedBins : [];

    return source
      .map(getCoordinates)
      .filter(Boolean);
  }, [bins, pickupSequence]);

  const viewportPoints =
    routePoints.length > 0
      ? routePoints
      : validBins.map((bin) => bin.coordinates);

  return (
    <section
      className="route-map"
      style={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          padding: "14px 16px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: 17 }}>
            Smart Bin Route Map
          </h3>
          <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 12 }}>
            {validBins.length} bins with valid coordinates
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 11,
            color: "#475569",
          }}
        >
          {[
            ["#16a34a", "Normal"],
            ["#eab308", "Medium"],
            ["#f97316", "High"],
            ["#dc2626", "Critical"],
          ].map(([color, label]) => (
            <span
              key={label}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: color,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ height, width: "100%" }}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {viewportPoints.length > 0 && (
            <MapViewport points={viewportPoints} />
          )}

          {routePoints.length > 1 && (
            <Polyline
              positions={routePoints}
              pathOptions={{
                color: "#166534",
                weight: 5,
                opacity: 0.8,
              }}
            />
          )}

          {validBins.map((bin) => {
            const fill = getFill(bin);
            const id = bin.id ?? bin.bin_id;
            const selected =
              selectedBinId != null &&
              String(selectedBinId) === String(id);

            return (
              <Marker
                key={id ?? `${bin.coordinates[0]}-${bin.coordinates[1]}`}
                position={bin.coordinates}
                icon={createBinIcon(fill, selected)}
                eventHandlers={{
                  click: () => {
                    if (typeof onBinClick === "function") {
                      onBinClick(bin);
                    }
                  },
                }}
              >
                <Popup>
                  <div style={{ minWidth: 150 }}>
                    <strong>
                      {bin.name || bin.bin_code || `Bin ${id}`}
                    </strong>
                    <p style={{ margin: "6px 0" }}>
                      Fill level: {fill}%
                    </p>
                    <p style={{ margin: "6px 0" }}>
                      Status:{" "}
                      {fill >= 90
                        ? "Critical"
                        : fill >= 80
                        ? "High"
                        : fill >= 50
                        ? "Medium"
                        : "Normal"}
                    </p>
                    <p style={{ margin: "6px 0" }}>
                      {bin.location || bin.area || "Location unavailable"}
                    </p>
                    {onBinClick && (
                      <button
                        type="button"
                        onClick={() => onBinClick(bin)}
                        style={{
                          border: 0,
                          borderRadius: 6,
                          padding: "7px 10px",
                          background: "#166534",
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        View Bin
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {validBins.length === 0 && (
        <p
          style={{
            padding: 12,
            margin: 0,
            color: "#64748b",
            fontSize: 12,
          }}
        >
          No bins have valid latitude and longitude coordinates yet.
        </p>
      )}
    </section>
  );
}
