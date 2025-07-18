import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContent";
import authService from "./api/authService.js";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProblemDetailPage from "./pages/ProblemDetail.page";

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
