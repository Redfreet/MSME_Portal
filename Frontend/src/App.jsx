import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContent";
import authService from "./api/authService.js";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProblemDetailPage from "./pages/ProblemDetail.page";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProblemPage from "./pages/CreateProblem.page";
import ProfilePage from "./pages/Profile.page";
import EditProfilePage from "./pages/editProfile.page";
import EditProblemPage from "./pages/editProblem.page";
import AdminPage from "./pages/admin.page";
import EditAdminPage from "./pages/editAdmin.page.jsx";
import DashboardPage from "./pages/dashboard.page.jsx";

function App() {
  const { authUser, setAuthUser, setLoading } = useAuth();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await authService.getMe();
        setAuthUser(response.data);
      } catch (error) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [setAuthUser, setLoading]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/problem/:id" element={<ProblemDetailPage />} />

            <Route
              element={<ProtectedRoute allowedRoles={["corporate", "admin"]} />}
            >
              <Route path="/create-problem" element={<CreateProblemPage />} />
              <Route path="/problem/:id/edit" element={<EditProblemPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/problems" element={<AdminPage />} />
              <Route
                path="/admin/problem/edit/:id"
                element={<EditAdminPage />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["corporate", "collaborator", "admin"]}
                />
              }
            >
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
