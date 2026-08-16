import { useAuth } from "../../context/AuthContext";
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user)
    return (
      <p className="text-center py-10 text-text-secondary">Please log in.</p>
    );
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <p className="text-center py-10 text-danger">Access denied.</p>;
  }
  return children;
}
