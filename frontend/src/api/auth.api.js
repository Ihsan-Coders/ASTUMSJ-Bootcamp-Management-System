import axiosInstance from "./axiosInstance";
export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);
export const loginUser = (data) => axiosInstance.post("/auth/login", data);
export const forgotPassword = (email) =>
  axiosInstance.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  axiosInstance.post(`/auth/reset-password/${token}`, { password });
