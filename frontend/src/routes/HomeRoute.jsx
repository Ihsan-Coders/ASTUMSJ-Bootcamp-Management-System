import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";

// Shows the public landing page for guests, but redirects logged-in users
// straight to their role-specific dashboard instead of the marketing page.
export default function HomeRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <LandingPage />;
}
