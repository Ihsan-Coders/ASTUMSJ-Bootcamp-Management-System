import { Routes, Route } from "react-router-dom";
//import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import MentorProgressPage from "../pages/mentor/ProgressPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomeRoute from "./HomeRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageBatches from "../pages/admin/ManageBatches";
import ReportsPage from "../pages/admin/ReportsPage"

import MentorDashboard from "../pages/mentor/MentorDashboard";
import AttendancePage from "../pages/mentor/AttendancePage";
import AssignmentsPage from "../pages/mentor/AssignmentsPage";

import StudentDashboard from "../pages/student/StudentDashboard";
import MyAttendance from "../pages/student/MyAttendance";
import MyProgress from "../pages/student/MyProgress";
import MyTimeline from "../pages/student/MyTimeline";
//import Profile from "../pages/student/Profile";

import ResourceLibraryPage from "../pages/ResourceLibraryPage";
import AlumniPage from "../pages/AlumniPage";
import LeaderboardPage from "../pages/LeaderboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/resources" element={<ResourceLibraryPage />} />
      <Route path="/alumni" element={<AlumniPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/batches"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageBatches />
          </ProtectedRoute>
        }
      />
       <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      /> 

      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/attendance"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/mentor/assignments"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <AssignmentsPage />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/mentor/progress"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <MentorProgressPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
       <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyAttendance />
          </ProtectedRoute>
        }
      /> 
       <Route
        path="/student/progress"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyProgress />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/student/timeline"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyTimeline />
          </ProtectedRoute>
        }
      /> 
      {/* <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      /> */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
