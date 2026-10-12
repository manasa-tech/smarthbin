import api from "./api";

// Fetch optimized waste collection routes
export const fetchOptimizedRoutes = async () => {
  const response = await api.get("/api/routes/optimized");
  return response.data;
};

// Generate an optimized route for priority bins
export const optimizeRoute = async (binIds = []) => {
  const response = await api.post("/api/routes/optimize", {
    bin_ids: binIds,
  });
  return response.data;
};

// Fetch route details by ID
export const fetchRouteById = async (routeId) => {
  const response = await api.get(`/api/routes/${routeId}`);
  return response.data;
};

// Fetch route distance and estimated collection time
export const fetchRouteSummary = async () => {
  const response = await api.get("/api/routes/summary");
  return response.data;
};

export default {
  fetchOptimizedRoutes,
  optimizeRoute,
  fetchRouteById,
  fetchRouteSummary,
};
