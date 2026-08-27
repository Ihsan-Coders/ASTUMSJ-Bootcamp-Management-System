import axiosInstance from './axiosInstance';

// Public — the registration form.
export const submitApplication = (data) => axiosInstance.post('/applications', data);

// Admin
export const getApplications = (params) => axiosInstance.get('/applications', { params });
export const getApplicationById = (id) => axiosInstance.get(`/applications/${id}`);
export const approveApplication = (id) => axiosInstance.put(`/applications/${id}/approve`);
export const rejectApplication = (id) => axiosInstance.put(`/applications/${id}/reject`);
export const assignApplicationMentor = (id, mentorId) =>
  axiosInstance.put(`/applications/${id}/assign-mentor`, { mentorId });

// Mentor
export const getMyAssignedApplicants = () => axiosInstance.get('/applications/assigned/mine');
// data: { answers: [{ questionId, score }], note }
export const submitInterviewResult = (id, data) =>
  axiosInstance.put(`/applications/${id}/interview-result`, data);

// Admin — final decision after the mentor's interview result is in.
export const finalDecision = (id, decision) =>
  axiosInstance.put(`/applications/${id}/final-decision`, { decision });
