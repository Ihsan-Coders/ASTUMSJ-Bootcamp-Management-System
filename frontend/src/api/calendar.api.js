import axiosInstance from './axiosInstance';

export const getEvents = (params) => axiosInstance.get('/calendar', { params });
export const createEvent = (data) => axiosInstance.post('/calendar', data);
export const updateEvent = (id, data) => axiosInstance.put(`/calendar/${id}`, data);
export const deleteEvent = (id) => axiosInstance.delete(`/calendar/${id}`);
