import axiosInstance from './axiosInstance';

export const createSubmission = (formData) =>axiosInstance.post('/submissions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const gradeSubmission = (id, data) => axiosInstance.put(`/submissions/${id}/grade`, data);
export const getSubmissions = (params) => axiosInstance.get('/submissions', { params });
export const updateSubmission = (id, data) =>axiosInstance.put(`/submissions/${id}`, data);
