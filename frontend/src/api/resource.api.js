import axiosInstance from "./axiosInstance";
export const getResources = (params) =>
  axiosInstance.get("/resources", { params });
export const createResource = (data) => axiosInstance.post("/resources", data);
