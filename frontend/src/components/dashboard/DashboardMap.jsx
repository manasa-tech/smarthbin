import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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
  const value = Number(
    bin.fill_level ?? bin.fill_percentage ?? bin.fillLevel ?? 0
  );

  return Number.isFinite(value)
    ? Math.max(0, Math.min(100, value))
    : 0;
}

function getStatus(fill) {
  if (fill >= 90) return "Critical";
  if (fill >= 80) return "High";
  if (fill >= 50) return "Medium";
  return "Normal";
}

function getColor(fill) {
  if (fill >= 90) return "#dc2626";
  if (fill >= 80) return "#f97316";
  if (fill >= 50) return "#eab308";
  return "#16a34a";
}

function createBinIcon(fill) {
  const color = getColor(fill);

  return L.divIcon({
    className: "dashboard-bin-marker",
    html: `
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:32px;
        height:32px;
        border-radius:50%;
        background:${color};
        color:white;
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,.25);
        font-size:10px;
        font-weight:800;
      ">${Math.round(fill)}%</div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
}

function FitBins({ positions }) {
  const map = useMap();

  useMemo(() => {
    if (positions.length > 0) {
      map.fitBounds(positions, {
        padding: [30, 30],
        maxZoom: 15,
      });
    }
  }, [map, positions]);

  return null;
}

export default function DashboardMap({
  bins = [],
  height = "360px",
  onBinClick,
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

  const positions = useMemo(
    () => validBins.map((bin) => bin.coordinates),
    [validBins]
  );

  const criticalCount = validBins.filter(
    (bin) => getFill(bin) >= 90
  ).length;

  const highCount = validBins.filter(
    (bin) => getFill(bin) >= 80 && getFill(bin) < 90
  ).length;

  return (
    <section
      className="dashboard-map"
      style={{
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          padding: 16,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 17, color: "#0f172a" }}>
            Smart Bin Locations
          </h3>
          <p style={{ margin: "5px 0 0", fontSize: 12, color: "#64748b" }}>
            {validBins.length} bins displayed on the map
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
          <span style={{ color: "#c2410c" }}>
            High: {highCount}
          </span>
          <span style={{ color: "#b91c1c" }}>
            Critical: {criticalCount}
          </span>
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

          {positions.length > 0 && <FitBins positions={positions} />}

          {validBins.map((bin, index) => {
            const fill = getFill(bin);
            const id = bin.id ?? bin.bin_id ?? index;

            return (
              <Marker
                key={id}
                position={bin.coordinates}
                icon={createBinIcon(fill)}
                eventHandlers={{
                  click: () => onBinClick?.(bin),
                }}
              >
                <Popup>
                  <div style={{ minWidth: 150 }}>
                    <strong>
                      {bin.name || bin.bin_code || `Bin ${id}`}
                    </strong>

                    <p style={{ margin: "7px 0" }}>
                      Fill level: <strong>{fill}%</strong>
                    </p>

                    <p style={{ margin: "7px 0" }}>
                      Status: {getStatus(fill)}
                    </p>

                    <p style={{ margin: "7px 0" }}>
                      {bin.location || bin.area || "Location unavailable"}
                    </p>

                    {onBinClick && (
                      <button
                        type="button"
                        onClick={() => onBinClick(bin)}
                        style={{
                          padding: "7px 10px",
                          border: 0,
                          borderRadius: 6,
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
            margin: 0,
            padding: 14,
            color: "#64748b",
            fontSize: 12,
          }}
        >
          No bins with valid latitude and longitude coordinates were found.
          Add coordinates to your bin data to display markers.
        </p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          padding: "12px 16px",
          borderTop: "1px solid #e2e8f0",
          fontSize: 11,
          color: "#475569",
        }}
      >
        {[
          ["#16a34a", "Normal: 0–49%"],
          ["#eab308", "Medium: 50–79%"],
          ["#f97316", "High: 80–89%"],
          ["#dc2626", "Critical: 90–100%"],
        ].map(([color, label]) => (
          <span
            key={label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
