import axiosInstance from "./axiosInstance";

export const getAlumni = () => axiosInstance.get("/alumni");

export const createAlumniProfile = (data) =>
  axiosInstance.post("/alumni", data);

export const updateAlumniProfile = (id, data) =>
  axiosInstance.put(`/alumni/${id}`, data);

export const deleteAlumniProfile = (id) =>
  axiosInstance.delete(`/alumni/${id}`);