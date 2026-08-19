import axiosInstance from './axiosInstance';

export const getUsers = (params) => axiosInstance.get('/users', { params });
export const createUser = (data) => axiosInstance.post('/users', data);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
export const getPendingUsers = () => axiosInstance.get('/users/pending');
export const approveUser = (id) => axiosInstance.put(`/users/${id}/approve`);
