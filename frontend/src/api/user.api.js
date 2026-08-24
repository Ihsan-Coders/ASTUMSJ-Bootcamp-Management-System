import axiosInstance from './axiosInstance';

export const getMe = () => axiosInstance.get('/users/me');
export const updateMe = (data) => axiosInstance.put('/users/me', data);

export const getUsers = (params) => axiosInstance.get('/users', { params });
export const createUser = (data) => axiosInstance.post('/users', data);
export const createMentor = (data) => axiosInstance.post('/users/mentors', data);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);
export const getPendingUsers = () => axiosInstance.get('/users/pending');
export const approveUser = (id) => axiosInstance.put(`/users/${id}/approve`);
export const changePassword = (data) =>axiosInstance.put('/users/me/password', data);