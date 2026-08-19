import axiosInstance from "./axiosInstance";
export const getLeaderboard = (batchId) =>
  axiosInstance.get("/leaderboard", { params: { batchId } });
