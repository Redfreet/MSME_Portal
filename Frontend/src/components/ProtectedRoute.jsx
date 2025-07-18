import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContent";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-8">Checking authentication...</div>;
  }

  //replace prevents the user from going back to the protected page.
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(authUser.role)) {
    return <Navigate to="/" replace />;
  }

  //Outlet is a placeholder for the actual page component
  return <Outlet />;
};

export default ProtectedRoute;
