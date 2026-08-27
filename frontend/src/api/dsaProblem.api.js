import axiosInstance from "./axiosInstance";

export const createDSAProblem = (data) =>
  axiosInstance.post("/dsa-problems", data);

export const getMyDSAProblems = () => axiosInstance.get("/dsa-problems/mine");

export const getWeeklyDSAActivity = (startDate, endDate) =>
  axiosInstance.get("/dsa-problems/weekly", {
    params: {
      startDate,
      endDate,
    },
  });
