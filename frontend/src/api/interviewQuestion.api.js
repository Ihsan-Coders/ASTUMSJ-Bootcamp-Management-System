import axiosInstance from './axiosInstance';

export const getInterviewQuestions = () => axiosInstance.get('/interview-questions');
export const createInterviewQuestion = (data) =>
  axiosInstance.post('/interview-questions', data);
export const updateInterviewQuestion = (id, data) =>
  axiosInstance.put(`/interview-questions/${id}`, data);
export const deleteInterviewQuestion = (id) =>
  axiosInstance.delete(`/interview-questions/${id}`);
