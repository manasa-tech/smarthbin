import api from "./api";

// Fetch all smart bins
export const fetchBins = async () => {
  const response = await api.get("/api/bins");
  return Array.isArray(response.data)
    ? response.data
    : response.data.bins || [];
};

// Fetch one bin by ID
export const fetchBinById = async (binId) => {
  const response = await api.get(`/api/bins/${binId}`);
  return response.data;
};

// Update a bin
export const updateBin = async (binId, updates) => {
  const response = await api.patch(`/api/bins/${binId}`, updates);
  return response.data;
};

// Fetch bins requiring priority collection
export const fetchPriorityBins = async () => {
  const response = await api.get("/api/priority-bins");
  return Array.isArray(response.data)
    ? response.data
    : response.data.bins || [];
};

// Fetch dashboard statistics
export const fetchBinStats = async () => {
  const response = await api.get("/api/dashboard/stats");
  return response.data;
};

// Create a new bin, if supported by the backend
export const createBin = async (binData) => {
  const response = await api.post("/api/bins", binData);
  return response.data;
};
