
/* =========================================
   SMARTBIN - APPLICATION CONSTANTS
   File: src/utils/constants.js
========================================= */

// Application details
export const APP_NAME = "SmartBin";

export const APP_TAGLINE =
  "AI-Powered Smart Waste Management System";

// API configuration
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

// Backend endpoints currently defined in the FastAPI backend
export const API_ENDPOINTS = {
  HEALTH: "/api/health",
  BINS: "/api/bins",
  PRIORITY_BINS: "/api/priority-bins",
  DASHBOARD_STATS: "/api/dashboard/stats",
};

// Bin fill-level thresholds (percentage)
export const BIN_FILL_THRESHOLDS = {
  NORMAL_MAX: 49,
  MEDIUM_MAX: 79,
  HIGH_MIN: 80,
  CRITICAL_MIN: 90,
};

// Bin status labels
export const BIN_STATUS = {
  EMPTY: "Empty",
  NORMAL: "Normal",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

// Determine the display status based on fill percentage
export const getBinStatus = (fillLevel) => {
  const fill = Number(fillLevel);

  if (!Number.isFinite(fill)) {
    return BIN_STATUS.NORMAL;
  }

  if (fill <= 0) return BIN_STATUS.EMPTY;
  if (fill >= BIN_FILL_THRESHOLDS.CRITICAL_MIN) {
    return BIN_STATUS.CRITICAL;
  }
  if (fill >= BIN_FILL_THRESHOLDS.HIGH_MIN) {
    return BIN_STATUS.HIGH;
  }
  if (fill > BIN_FILL_THRESHOLDS.NORMAL_MAX) {
    return BIN_STATUS.MEDIUM;
  }

  return BIN_STATUS.NORMAL;
};

// Waste classification categories
export const WASTE_CATEGORIES = {
  WET: "Wet Waste",
  DRY: "Dry Waste",
  RECYCLABLE: "Recyclable",
  HAZARDOUS: "Hazardous Waste",
};

// Waste category display options
export const WASTE_CATEGORY_OPTIONS = [
  {
    value: "wet",
    label: "Wet Waste",
    description: "Food scraps and other biodegradable waste",
  },
  {
    value: "dry",
    label: "Dry Waste",
    description: "Paper, packaging, and non-wet waste",
  },
  {
    value: "recyclable",
    label: "Recyclable",
    description: "Materials that can be recycled",
  },
  {
    value: "hazardous",
    label: "Hazardous Waste",
    description: "Waste requiring special handling",
  },
];

// Citizen report categories
export const REPORT_CATEGORIES = [
  { value: "overflowing_bin", label: "Overflowing Bin" },
  { value: "illegal_dumping", label: "Illegal Dumping" },
  { value: "missed_collection", label: "Missed Collection" },
  { value: "damaged_bin", label: "Damaged Bin" },
  { value: "other", label: "Other" },
];

// Citizen report statuses
export const REPORT_STATUS = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

// Report priority levels
export const REPORT_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

// Navigation routes
export const APP_ROUTES = {
  DASHBOARD: "/",
  CITY_SIMULATOR: "/simulator",
  AI_CLASSIFIER: "/classifier",
  ROUTE_OPTIMIZER: "/routes",
  OVERFLOW_PREDICTION: "/predictions",
  CITIZEN_REPORTS: "/reports",
  REPORTS_HISTORY: "/reports/history",
};

// Default simulator configuration
export const SIMULATOR_CONFIG = {
  DEFAULT_BIN_COUNT: 18,
  MIN_FILL_LEVEL: 0,
  MAX_FILL_LEVEL: 100,
  DEFAULT_COLLECTION_THRESHOLD: 80,
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// General application settings
export const APP_CONFIG = {
  DEFAULT_MAP_ZOOM: 12,
  REQUEST_TIMEOUT: 15000,
  MAX_IMAGE_SIZE_MB: 5,
  SUPPORTED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],
};
