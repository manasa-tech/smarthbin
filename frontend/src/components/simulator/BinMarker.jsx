import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function BinMarker({ bin, onClick }) {
  const fill = Number(
    bin.fill_level ?? bin.fill_percentage ?? 0
  );

  const status =
    fill >= 90
      ? "Critical"
      : fill >= 80
      ? "High"
      : fill >= 50
      ? "Medium"
      : "Normal";

  const latitude = Number(
    bin.latitude ?? bin.lat ?? bin.location?.latitude
  );

  const longitude = Number(
    bin.longitude ?? bin.lng ?? bin.lon ?? bin.location?.longitude
  );

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const icon = useMemo(() => {
    const color =
      fill >= 90
        ? "#dc2626"
        : fill >= 80
        ? "#f97316"
        : fill >= 50
        ? "#eab308"
        : "#16a34a";

    return L.divIcon({
      className: "smartbin-map-marker",
      html: `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 700;
        ">${Math.round(fill)}%</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  }, [fill]);

  if (!hasCoordinates) return null;

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick(bin);
    }
  };

  return (
    <Marker
      position={[latitude, longitude]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>
        <div style={{ minWidth: 160 }}>
          <strong>
            {bin.name ||
              bin.bin_code ||
              `Smart Bin ${bin.id ?? bin.bin_id ?? ""}`}
          </strong>

          <p style={{ margin: "8px 0 4px" }}>
            Fill level: <strong>{Math.round(fill)}%</strong>
          </p>

          <p style={{ margin: "4px 0" }}>
            Status: <strong>{status}</strong>
          </p>

          <p style={{ margin: "4px 0" }}>
            Location: {bin.location_name || bin.area || "Not specified"}
          </p>

          <button
            type="button"
            onClick={handleClick}
            style={{
              marginTop: 8,
              padding: "7px 12px",
              border: "none",
              borderRadius: 6,
              background: "#166534",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
