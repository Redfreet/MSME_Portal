import { useState } from "react";
import { useNavigate } from "react-router-dom";
import problemService from "../api/problemService.api.js";

const CreateProblemPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    urgency: "Low",
    region: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const problemFormData = new FormData();
      problemFormData.append("title", formData.title);
      problemFormData.append("description", formData.description);
      problemFormData.append("urgency", formData.urgency);
      problemFormData.append("region", formData.region);

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      tagsArray.forEach((tag) => problemFormData.append("tags", tag));

      if (attachment) {
        problemFormData.append("attachment", attachment);
      }

      const response = await problemService.createProblem(problemFormData);

      navigate(`/problem/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create problem.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Post a New Problem
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Problem Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Detailed Description
            </label>
            <textarea
              name="description"
              id="description"
              required
              rows="8"
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="attachment"
              className="block text-sm font-medium text-gray-700"
            >
              Attachment (Optional)
            </label>
            <input
              type="file"
              name="attachment"
              id="attachment"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Attachment Preview"
                  className="max-h-48 rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="urgency"
                className="block text-sm font-medium text-gray-700"
              >
                Urgency
              </label>
              <select
                name="urgency"
                id="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                Region (Optional)
              </label>
              <input
                type="text"
                name="region"
                id="region"
                placeholder="e.g., Delhi, Jharkhand"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                value={formData.region}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              placeholder="e.g., Marketing, Tech, Urgent"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? "Posting..." : "Post Problem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblemPage;
