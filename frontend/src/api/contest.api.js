import axiosInstance from "./axiosInstance";

export const getContests = (batchId) =>
  axiosInstance.get("/contests", { params: { batchId } });
export const getContestById = (id) => axiosInstance.get(`/contests/${id}`);
export const createContest = (data) => axiosInstance.post("/contests", data);
export const fetchContestResults = (id) =>
  axiosInstance.post(`/contests/${id}/fetch-results`);
export const getContestLeaderboard = (id) =>
  axiosInstance.get(`/contests/${id}/leaderboard`);
