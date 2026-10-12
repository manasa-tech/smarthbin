import { useCallback, useEffect, useState } from "react";
import {
  fetchReports,
  createReport,
  updateReportStatus,
} from "../services/reportService";

export default function useReports(autoFetch = true) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all citizen reports
  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchReports();
      const reportList = Array.isArray(data)
        ? data
        : data.reports || [];

      setReports(reportList);
      return reportList;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load citizen reports.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit a new citizen report
  const submitReport = useCallback(async (reportData) => {
    setSubmitting(true);
    setError(null);

    try {
      const newReport = await createReport(reportData);

      setReports((currentReports) => [
        newReport,
        ...currentReports,
      ]);

      return newReport;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to submit the report.";

      setError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // Update a report's status
  const changeReportStatus = useCallback(
    async (reportId, status) => {
      setError(null);

      try {
        const updatedReport = await updateReportStatus(
          reportId,
          status
        );

        setReports((currentReports) =>
          currentReports.map((report) =>
            (report.id ?? report.report_id) === reportId
              ? { ...report, ...updatedReport }
              : report
          )
        );

        return updatedReport;
      } catch (err) {
        const message =
          err.response?.data?.detail ||
          err.message ||
          "Failed to update report status.";

        setError(message);
        throw err;
      }
    },
    []
  );

  // Automatically load reports when the hook is mounted
  useEffect(() => {
    if (autoFetch) {
      loadReports().catch(() => {});
    }
  }, [autoFetch, loadReports]);

  return {
    reports,
    setReports,
    loading,
    submitting,
    error,
    loadReports,
    submitReport,
    changeReportStatus,
  };
}
