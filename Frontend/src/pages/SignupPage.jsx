import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../api/authService";
import industryService from "../api/industryService.api";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "collaborator",
    industry: "",
  });

  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await industryService.getAllIndustries();
        setIndustries(response.data || []);
      } catch (err) {
        console.error("Failed to fetch industries:", err);
        setError("Could not load industry list. Please try again later.");
      }
    };
    fetchIndustries();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.signup(formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              minLength="3"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              minLength="6"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">I am a...</span>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="collaborator"
                  checked={formData.role === "collaborator"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Collaborator</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="corporate"
                  checked={formData.role === "corporate"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Company / MSME</span>
              </label>
            </div>
          </div>

          {formData.role === "corporate" && (
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700"
              >
                Industry
              </label>
              <select
                name="industry"
                id="industry"
                required={formData.role === "corporate"}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={formData.industry}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your industry...
                </option>
                {industries.map((industry) => (
                  <option key={industry._id} value={industry._id}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
