import { useState } from "react";
import problemService from "../api/problemService.api.js";

const SolutionForm = ({ problemId, onSolutionSubmit }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Solution content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await problemService.submitSolution(problemId, {
        content,
      });
      onSolutionSubmit(response.data); // Pass the new solution to the parent
      setContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit solution.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Submit Your Solution or Comment
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="5"
          placeholder="Share your thoughts, suggestions, or a complete solution..."
          required
        ></textarea>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SolutionForm;
