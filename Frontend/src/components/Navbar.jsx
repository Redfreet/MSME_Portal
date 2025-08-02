import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContent";
import authService from "../api/authService.js";

const Navbar = () => {
  const { authUser, setAuthUser, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-[#E0E0E0] text-[#333333] font-mono font-bold p-4 mb-8 shadow-md">
      <div className="container h-5 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-gray-800"
        >
          MSME Portal
        </Link>
        <div className="hidden md:flex items-center gap-3 text-lg">
          {/* Conditional rendering based on auth state */}
          {loading ? (
            <span>Loading...</span>
          ) : authUser ? (
            // If user is logged in
            <>
              <Link
                to="/profile"
                className="font-semibold hover:text-[#121212] transition-colors"
              >
                Welcome, {authUser.fullName.split(" ")[0]}!
              </Link>

              <Link
                to="/dashboard"
                className="uppercase border border-gray-700 hover:border-purple-800 hover:text-purple-700 px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 text-base"
              >
                Dashboard
              </Link>

              {authUser.role === "corporate" && (
                <Link
                  to="/create-problem"
                  className="border border-gray-700 hover:border-green-600 hover:text-green-600 uppercase px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 text-base"
                >
                  Post
                </Link>
              )}

              {authUser.role === "admin" && (
                <Link
                  to="/admin"
                  className="uppercase border border-gray-700 hover:border-blue-800 hover:text-blue-700 px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-base"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className=" uppercase border border-gray-700 hover:border-red-800 hover:text-red-700 px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-gray-700 hover:border-green-600 hover:text-green-600 uppercase px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 text-base"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="border border-gray-700 hover:border-green-600 hover:text-green-600 uppercase px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 text-base"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/*Hamburger Menu Button for small screens)*/}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-1">
          <div className="flex flex-col items-center text-center">
            {loading ? (
              <span></span>
            ) : authUser ? (
              <>
                <Link
                  to="/profile"
                  className="w-full py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Welcome, {authUser.fullName.split(" ")[0]}!
                </Link>
                <Link
                  to="/dashboard"
                  className="w-full py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {authUser.role === "corporate" && (
                  <Link
                    to="/create-problem"
                    className="w-full py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post Problem
                  </Link>
                )}
                {authUser.role === "admin" && (
                  <Link
                    to="/admin"
                    className="w-full py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
