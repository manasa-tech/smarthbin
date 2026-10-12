import api from "./api";

// Submit a new citizen waste report
export const createReport = async (reportData) => {
  const response = await api.post("/api/reports", reportData);
  return response.data;
};

// Fetch all citizen reports
export const fetchReports = async () => {
  const response = await api.get("/api/reports");
  return Array.isArray(response.data)
    ? response.data
    : response.data.reports || [];
};

// Fetch one report by ID
export const fetchReportById = async (reportId) => {
  const response = await api.get(`/api/reports/${reportId}`);
  return response.data;
};

// Update a report's status
export const updateReportStatus = async (reportId, status) => {
  const response = await api.patch(`/api/reports/${reportId}`, {
    status,
  });
  return response.data;
};

// Delete a report, if supported by the backend
export const deleteReport = async (reportId) => {
  const response = await api.delete(`/api/reports/${reportId}`);
  return response.data;
};

export default {
  createReport,
  fetchReports,
  fetchReportById,
  updateReportStatus,
  deleteReport,
};
