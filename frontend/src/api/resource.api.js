import axiosInstance from "./axiosInstance";

export const getResources = (params) =>
  axiosInstance.get("/resources", { params });

// `data` may be a plain object (Link/Video resources) or a FormData instance
// (Document resources, which include a real file upload).
export const createResource = (data) => {
  const isFormData = data instanceof FormData;
  return axiosInstance.post("/resources", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
};

export const deleteResource = (id) => axiosInstance.delete(`/resources/${id}`);
