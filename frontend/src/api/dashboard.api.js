import axiosInstance from "./axiosInstance";
export const getAdminDashboard = () => axiosInstance.get("/dashboard/admin");
export const getMentorDashboard = () => axiosInstance.get("/dashboard/mentor");
export const getStudentDashboard = () =>
  axiosInstance.get("/dashboard/student");
