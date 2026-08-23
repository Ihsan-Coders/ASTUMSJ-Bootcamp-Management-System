import axiosInstance from './axiosInstance';

export const getAnnouncements = (params) => axiosInstance.get('/announcements', { params });
export const createAnnouncement = (data) => axiosInstance.post('/announcements', data);
export const updateAnnouncement = (id, data) => axiosInstance.put(`/announcements/${id}`, data);
export const deleteAnnouncement = (id) => axiosInstance.delete(`/announcements/${id}`);
