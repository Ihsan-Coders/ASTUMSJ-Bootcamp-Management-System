// Import the configured Axios instance.
// This is used to communicate with our backend API.
import axiosInstance from "./axiosInstance";

// Get announcements from the backend.
//
// params can contain query parameters such as:
// { batchId: '...' }
//
// Example:
// getAnnouncements({ batchId: '123' })
export const getAnnouncements = (params) =>
  axiosInstance.get("/announcements", { params });

// Create a new announcement.
//
// data contains the announcement information
// sent to the backend.
export const createAnnouncement = (data) =>
  axiosInstance.post("/announcements", data);
