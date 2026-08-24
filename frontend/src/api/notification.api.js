import axiosInstance from './axiosInstance';

export const getNotifications = () => axiosInstance.get('/notifications');
export const getUnreadNotificationCount = () => axiosInstance.get('/notifications/unread-count');
export const markNotificationRead = (id) => axiosInstance.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => axiosInstance.put('/notifications/read-all');
