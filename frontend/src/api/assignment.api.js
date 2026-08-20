import axiosInstance from './axiosInstance';

export const getAssignments = (params) => axiosInstance.get('/assignments', { params });
export const createAssignment = (data) => axiosInstance.post('/assignments', data);
export const updateAssignment = (id, data) => axiosInstance.put(`/assignments/${id}`, data);
export const deleteAssignment = (id) => axiosInstance.delete(`/assignments/${id}`);
