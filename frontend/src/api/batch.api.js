import axiosInstance from './axiosInstance';

export const getBatches = () => axiosInstance.get('/batches');
export const createBatch = (data) => axiosInstance.post('/batches', data);
export const assignMentor = (data) => axiosInstance.post('/batches/assign-mentor', data);
export const enrollStudent = (data) => axiosInstance.post('/batches/enroll-student', data);

export const updateBatch = (id, data) => axiosInstance.put(`/batches/${id}`, data);
export const deleteBatch = (id) => axiosInstance.delete(`/batches/${id}`);
export const setAcceptingBatch = (id) => axiosInstance.put(`/batches/${id}/set-accepting`);
