import axiosInstance from "./axiosInstance";

export const getPublicDashboard = () => axiosInstance.get("/dashboard/public");
export const getPublicMentors = () =>
  axiosInstance.get("/dashboard/public/mentors");
export const getAdminDashboard = () => axiosInstance.get("/dashboard/admin");

export const getMentorDashboard = () => axiosInstance.get("/dashboard/mentor");

export const getStudentDashboard = () =>
  axiosInstance.get("/dashboard/student");
