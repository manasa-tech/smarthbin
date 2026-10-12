import api from "./api";

// Classify a waste image
export const classifyWaste = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await api.post("/api/classify", formData);
  return response.data;
};

// Alternative endpoint for image classification
export const analyzeWasteImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await api.post("/api/classify", formData);
  return response.data;
};

// Fetch classification history, if supported by the backend
export const fetchClassificationHistory = async () => {
  const response = await api.get("/api/classifications/history");
  return response.data;
};
