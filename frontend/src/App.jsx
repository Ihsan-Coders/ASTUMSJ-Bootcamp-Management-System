import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/common/Navbar";
import BottomNav from "./components/common/BottomNav";
import GirihBackground from "./components/common/GirihBackground";
import Footer from "./components/common/Footer";

import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

import AdminDashboard from "./pages/admin/AdminDashboard";


function AppContent() {
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col relative">
      <GirihBackground />

      <Navbar minimal={isAuthPage} />

      <main className="relative z-10 flex-1">
        <Routes>
          {/* Login / Register */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={`/${user.role}`} replace />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 px-4 pb-24 md:pb-8 min-h-[70vh]">
                  {showRegister ? <RegisterForm /> : <LoginForm />}

                  <button
                    onClick={() => setShowRegister(!showRegister)}
                    className="text-sm text-gold hover:underline"
                  >
                    {showRegister
                      ? "Already have an account? Login"
                      : "Need an account? Register"}
                  </button>
                </div>
              )
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;