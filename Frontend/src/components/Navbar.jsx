import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContent";
import authService from "../api/authService.js";

const Navbar = () => {
  const { authUser, setAuthUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setAuthUser(null); // Clear the user from global state
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 mb-8 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-400">
          MSME Portal
        </Link>
        <div className="flex items-center gap-6 text-lg">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>

          {/* Conditional rendering based on auth state */}
          {loading ? (
            <span>Loading...</span>
          ) : authUser ? (
            // If user is logged in
            <>
              <span className="font-semibold">
                Welcome, {authUser.fullName}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is logged out
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-blue-400 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
