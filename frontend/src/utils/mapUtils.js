
/* =========================================
   SMARTBIN - DATA FORMATTERS
   File: src/utils/formatters.js
========================================= */

// Format numbers using Indian number formatting
export const formatNumber = (value, maximumFractionDigits = 1) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
  }).format(number);
};

// Format bin fill level as a percentage
// Expected input: a number between 0 and 100
export const formatPercentage = (value) => {
  const number = Number(value);

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (!Number.isFinite(number)) return "—";

  return `${formatNumber(number, 1)}%`;
};

// Format dates, e.g. 10 Oct 2026
export const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Format dates and times
export const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

// Format time only, e.g. 10:30 AM
export const formatTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

// Display a relative time, e.g. 5 minutes ago
export const formatRelativeTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const differenceInSeconds = Math.round(
    (date.getTime() - Date.now()) / 1000
  );

  const units = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  const formatter = new Intl.RelativeTimeFormat("en-IN", {
    numeric: "auto",
  });

  for (const { unit, seconds } of units) {
    if (Math.abs(differenceInSeconds) >= seconds) {
      return formatter.format(
        Math.round(differenceInSeconds / seconds),
        unit
      );
    }
  }

  return "just now";
};

// Format distance in kilometres
export const formatDistance = (kilometres) => {
  const distance = Number(kilometres);

  if (kilometres === null || kilometres === undefined || kilometres === "") {
    return "—";
  }

  if (!Number.isFinite(distance) || distance < 0) return "—";

  if (distance < 1) {
    return `${formatNumber(distance * 1000, 0)} m`;
  }

  return `${formatNumber(distance, 2)} km`;
};

// Format duration when input is in minutes
export const formatDuration = (minutes) => {
  const duration = Number(minutes);

  if (minutes === null || minutes === undefined || minutes === "") {
    return "—";
  }

  if (!Number.isFinite(duration) || duration < 0) return "—";

  const totalMinutes = Math.round(duration);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
};

// Format monetary values in Indian rupees
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return "—";
  }

  const number = Number(amount);

  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(number);
};

// Format file sizes in bytes
export const formatFileSize = (bytes) => {
  const size = Number(bytes);

  if (bytes === null || bytes === undefined || bytes === "") {
    return "—";
  }

  if (!Number.isFinite(size) || size < 0) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) {
    return `${formatNumber(size / 1024, 2)} KB`;
  }

  return `${formatNumber(size / (1024 * 1024), 2)} MB`;
};

// Format bin IDs consistently
export const formatBinId = (id) => {
  if (id === null || id === undefined || id === "") {
    return "Unknown Bin";
  }

  const value = String(id).trim();

  if (!value) return "Unknown Bin";

  return /^bin[-_ ]?/i.test(value) ? value : `BIN-${value}`;
};

// Return a safe text value
export const formatText = (value, fallback = "—") => {
  if (value === null || value === undefined) return fallback;

  const text = String(value).trim();

  return text || fallback;
};

// Shorten long text with an ellipsis
export const truncateText = (value, maxLength = 50) => {
  if (value === null || value === undefined) return "";

  const text = String(value);

  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return ".".repeat(Math.max(0, maxLength));

  return `${text.slice(0, maxLength - 3)}...`;
};

// Format a location/address for display
export const formatAddress = (address) => {
  if (!address) return "Location unavailable";

  if (typeof address === "string") {
    return address.trim() || "Location unavailable";
  }

  if (typeof address === "object") {
    const parts = [
      address.address,
      address.street,
      address.area,
      address.city,
    ].filter(
      (part) => typeof part === "string" && part.trim().length > 0
    );

    return parts.join(", ") || "Location unavailable";
  }

  return "Location unavailable";
};
