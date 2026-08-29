import axiosInstance from './axiosInstance';

export const getRegistrationStatus = () => axiosInstance.get('/settings/registration');
export const updateRegistrationStatus = (data) => axiosInstance.put('/settings/registration', data);
