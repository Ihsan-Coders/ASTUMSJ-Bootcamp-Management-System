import axiosInstance from './axiosInstance';

// Public — the registration form.
export const submitApplication = (data) => axiosInstance.post('/applications', data);

// Admin — read-only listing/detail for now. Approve/reject/assign-mentor
// endpoints exist on the backend but are intentionally not wired up here
// yet (view-only phase).
export const getApplications = (params) => axiosInstance.get('/applications', { params });
export const getApplicationById = (id) => axiosInstance.get(`/applications/${id}`);