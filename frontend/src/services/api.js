import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log API errors clearly during development.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response
      ? `API error ${error.response.status}: ${
          error.response.data?.detail || error.message
        }`
      : error.code === "ECONNABORTED"
      ? "The server took too long to respond."
      : "Cannot connect to the backend. Check whether FastAPI is running.";

    console.error(message);
    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = async () => {
  const response = await api.get(API_ENDPOINTS.HEALTH);
  return response.data;
};

// Fetch all smart bins
export const getBins = async () => {
  const response = await api.get(API_ENDPOINTS.BINS);
  return Array.isArray(response.data)
    ? response.data
    : response.data.bins || [];
};

// Fetch a specific bin
export const getBinById = async (binId) => {
  const response = await api.get(`${API_ENDPOINTS.BINS}/${binId}`);
  return response.data;
};

// Update a bin, for example its fill level
export const updateBin = async (binId, updates) => {
  const response = await api.patch(
    `${API_ENDPOINTS.BINS}/${binId}`,
    updates
  );
  return response.data;
};

// Fetch bins that need collection
export const getPriorityBins = async () => {
  const response = await api.get(API_ENDPOINTS.PRIORITY_BINS);
  return Array.isArray(response.data)
    ? response.data
    : response.data.bins || [];
};

// Fetch dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD_STATS);
  return response.data;
};

// Default export for custom API calls
export default api;
