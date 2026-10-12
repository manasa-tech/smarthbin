import { useCallback, useEffect, useState } from "react";
import {
  fetchOptimizedRoutes,
  optimizeRoute,
  fetchRouteById,
  fetchRouteSummary,
} from "../services/routeService";

export default function useRoute(autoFetch = false) {
  const [routes, setRoutes] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch previously generated routes
  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchOptimizedRoutes();
      const routeList = Array.isArray(data)
        ? data
        : data.routes || [];

      setRoutes(routeList);
      return routeList;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load routes.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate an optimized route for selected bins
  const generateRoute = useCallback(async (binIds = []) => {
    setOptimizing(true);
    setError(null);

    try {
      const result = await optimizeRoute(binIds);
      setCurrentRoute(result);

      setRoutes((currentRoutes) => [
        result,
        ...currentRoutes,
      ]);

      return result;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to optimize the collection route.";

      setError(message);
      throw err;
    } finally {
      setOptimizing(false);
    }
  }, []);

  // Fetch a particular route by ID
  const loadRouteById = useCallback(async (routeId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchRouteById(routeId);
      setCurrentRoute(result);
      return result;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load route details.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch route distance and time summary
  const loadRouteSummary = useCallback(async () => {
    setError(null);

    try {
      const result = await fetchRouteSummary();
      setSummary(result);
      return result;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load route summary.";

      setError(message);
      throw err;
    }
  }, []);

  // Load routes automatically only when requested
  useEffect(() => {
    if (autoFetch) {
      loadRoutes().catch(() => {});
    }
  }, [autoFetch, loadRoutes]);

  return {
    routes,
    currentRoute,
    summary,
    loading,
    optimizing,
    error,
    loadRoutes,
    generateRoute,
    loadRouteById,
    loadRouteSummary,
    setCurrentRoute,
  };
}
