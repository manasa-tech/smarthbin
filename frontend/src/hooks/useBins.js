import { useCallback, useEffect, useState } from "react";
import { fetchBins, updateBin } from "../services/binService";

export default function useBins(autoFetch = true) {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadBins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBins();
      const binList = Array.isArray(data) ? data : data.bins || [];
      setBins(binList);
      return binList;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to fetch smart bins.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBins = useCallback(async () => {
    return loadBins();
  }, [loadBins]);

  const updateBinFill = useCallback(async (binId, fillLevel) => {
    setError(null);

    try {
      const updatedBin = await updateBin(binId, {
        fill_level: Number(fillLevel),
      });

      setBins((currentBins) =>
        currentBins.map((bin) =>
          (bin.id ?? bin.bin_id) === binId
            ? { ...bin, ...updatedBin }
            : bin
        )
      );

      return updatedBin;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to update the bin.";

      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      loadBins().catch(() => {});
    }
  }, [autoFetch, loadBins]);

  return {
    bins,
    setBins,
    loading,
    error,
    loadBins,
    refreshBins,
    updateBinFill,
  };
}
