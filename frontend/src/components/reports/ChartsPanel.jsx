import { useEffect, useState } from "react";

// Recharts components used to build our bar chart.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Our shared Axios instance for API requests.
import axiosInstance from "../../api/axiosInstance";

// Display attendance statistics for each batch.
export default function ChartsPanel() {
  // Stores the report data received from the backend.
  const [batchReports, setBatchReports] = useState([]);

  // Fetch report data when this component loads.
  useEffect(() => {
    axiosInstance.get("/reports").then((res) => {
      // Save the batch reports in React state.
      setBatchReports(res.data.data.batchReports);
    });
  }, []);

  return (
    <div className="glass-card glow-border rounded-xl p-5">
      {/* Chart title */}
      <h2 className="text-text-primary font-semibold mb-4">
        Attendance Rate by Batch
      </h2>

      {/* ResponsiveContainer makes the chart
          adjust to the available screen width. */}
      <ResponsiveContainer width="100%" height={250}>
        {/* Create a bar chart using batchReports */}
        <BarChart data={batchReports}>
          {/* Horizontal axis = batch names */}
          <XAxis dataKey="batchName" fontSize={12} />

          {/* Vertical axis = attendance percentage */}
          <YAxis fontSize={12} />

          {/* Shows information when hovering over a bar */}
          <Tooltip />

          {/* Creates the actual bars.
              attendanceRate comes from our backend report. */}
          <Bar dataKey="attendanceRate" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
