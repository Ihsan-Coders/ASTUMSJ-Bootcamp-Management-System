import axiosInstance from './axiosInstance';

export const markAttendance = (data) => axiosInstance.post('/attendance', data);
export const getAttendance = (params) => axiosInstance.get('/attendance', { params });
