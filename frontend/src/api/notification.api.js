// Import the configured Axios instance
// used to communicate with our backend.
import axiosInstance from "./axiosInstance";

// Get notifications belonging to the logged-in user.
export const getNotifications = () => axiosInstance.get("/notifications");

// Mark one notification as read.
//
// id is the notification's MongoDB ID.
export const markAsRead = (id) =>
  axiosInstance.put(`/notifications/${id}/read`);

// Mark all notifications as read.
export const markAllAsRead = () => axiosInstance.put("/notifications/read-all");
