import { Routes, Route } from "react-router-dom";
//import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
import MentorProgressPage from "../pages/mentor/ProgressPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomeRoute from "./HomeRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageBatches from "../pages/admin/ManageBatches";
import ReportsPage from "../pages/admin/ReportsPage";

import ManageAnnouncements from "../pages/admin/ManageAnnouncements";
import ManageApplications from "../pages/admin/ManageApplications";
import ManageAssignments from "../pages/admin/ManageAssignments";
import MentorDashboard from "../pages/mentor/MentorDashboard";
import ManageAlumni from "../pages/admin/ManageAlumni";
import MentorAttendancePage from "../pages/mentor/MentorAttendancePage"; // real mentor mark-attendance page
// import StudentAttendancePage from '../pages/mentor/AttendancePage'; // misplaced file, actually shows a student's own attendance
import AssignmentsPage from "../pages/mentor/AssignmentsPage";
import ApplicantsPage from "../pages/mentor/ApplicantsPage";

import StudentDashboard from "../pages/student/StudentDashboard";
import MyAttendance from "../pages/student/MyAttendance";
import MyProgress from "../pages/student/MyProgress";
import MyTimeline from "../pages/student/MyTimeline";
import Announcements from "../pages/student/Announcements"
import MyAssignments from "../pages/student/MyAssignments";
import Profile from "../pages/student/Profile";

import ResourceLibraryPage from "../pages/ResourceLibraryPage";
import AlumniPage from "../pages/AlumniPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import CalendarPage from "../pages/CalendarPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
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
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assignments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageAssignments />
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
        path="/admin/resources"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ResourceLibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alumni"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageAlumni />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/calendar"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "mentor", "student"]}>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Profile />
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
            <MentorAttendancePage />
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
        path="/mentor/applicants"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <ApplicantsPage />
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
        path="/mentor/resources"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <ResourceLibraryPage />
          </ProtectedRoute>
        }
      />
       <Route
        path="/mentor/calendar"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "mentor", "student"]}>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/mentor/profile"
        element={
          <ProtectedRoute allowedRoles={["mentor"]}>
            <Profile />
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
        path="/student/myassignments"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyAssignments />
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
        path="/student/resources"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ResourceLibraryPage/>
            </ProtectedRoute >
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
      <Route
        path="/student/calendar"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/announcements"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Announcements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/leaderboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "mentor", "student"]}>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      /> 
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Profile />
          </ProtectedRoute>
        }
      /> 

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
