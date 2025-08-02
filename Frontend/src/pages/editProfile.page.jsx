import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContent";
import authService from "../api/authService";
import industryService from "../api/industryService.api";

const EditProfilePage = () => {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    industry: "",
    website: "",
    companyName: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("null");
  const [isUploading, setIsUploading] = useState(false);

  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await industryService.getAllIndustries();
        setIndustries(response.data || []);
      } catch (err) {
        console.error("Failed to fetch industries:", err);
        setError("Could not load the list of industries.");
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        bio: authUser.profile?.bio || "",
        industry: authUser.industry?._id || "",
        website: authUser.website || "",
        companyName: authUser.companyName || "",
      });
      setPhotoPreview(
        authUser.profile?.profilePhoto ||
          `https://placehold.co/100x100/EFEFEF/AAAAAA?text=${authUser.fullName.charAt(
            0
          )}`
      );
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      alert("Please select a file first.");
      return;
    }
    setIsUploading(true);
    setError("");

    // console.log("Attempting to upload photo. File:", photoFile);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("profilePhoto", photoFile);

      // console.log("Calling authService.updateProfilePicture...");
      const response = await authService.updateProfilePicture(uploadFormData);
      // console.log("Upload successful. Response:", response.data);

      setAuthUser(response.data);
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      // This will now log the detailed frontend error
      console.error("Error caught in handlePhotoUpload:", err);
      setError(err.response?.data?.message || "Failed to upload photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.updateProfile(formData);
      // Update the user data in the global context
      setAuthUser(response.data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Profile Picture
        </h2>
        <div className="flex items-center space-x-6">
          {/* --- THIS LINE IS NOW CORRECTED --- */}
          {/* Conditionally render the image only when photoPreview is not null */}
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Profile Preview"
              className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-100"
            />
          )}
          <div className="flex-grow">
            <input
              type="file"
              name="profilePhoto"
              accept="image/png, image/jpeg"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              PNG or JPG. Max size 5MB.
            </p>
          </div>
          <button
            onClick={handlePhotoUpload}
            disabled={isUploading || !photoFile}
            className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Profile Details
        </h1>
        <div className="space-y-4">
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
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {authUser.role === "collaborator" && (
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
          )}
          {authUser.role === "corporate" && (
            <>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
