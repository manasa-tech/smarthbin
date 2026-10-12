import api from "./api";

// Fetch overflow predictions for all bins
export const fetchOverflowPredictions = async () => {
  const response = await api.get("/api/predictions/overflow");
  return response.data;
};

// Fetch the overflow prediction for one bin
export const fetchBinPrediction = async (binId) => {
  const response = await api.get(`/api/predictions/overflow/${binId}`);
  return response.data;
};

// Request a new prediction for a bin
export const predictBinOverflow = async (binId) => {
  const response = await api.post(`/api/predictions/overflow/${binId}`);
  return response.data;
};

// Fetch prediction history
export const fetchPredictionHistory = async () => {
  const response = await api.get("/api/predictions/history");
  return response.data;
};

export default {
  fetchOverflowPredictions,
  fetchBinPrediction,
  predictBinOverflow,
  fetchPredictionHistory,
};
