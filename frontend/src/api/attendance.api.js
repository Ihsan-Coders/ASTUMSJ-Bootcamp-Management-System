import axiosInstance from "./axiosInstance";

export const markAttendance = (data) =>
  axiosInstance.post("/attendance", data);

export const markBulkAttendance = (data) =>
  axiosInstance.post("/attendance/bulk", data);

export const updateAttendance = (id, data) =>
  axiosInstance.put(`/attendance/${id}`, data);

export const deleteAttendance = (id) =>
  axiosInstance.delete(`/attendance/${id}`);

export const getAttendance = (params = {}) =>
  axiosInstance.get("/attendance", { params });