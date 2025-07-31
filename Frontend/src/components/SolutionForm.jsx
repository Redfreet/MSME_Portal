import { useState } from "react";
import problemService from "../api/problemService.api.js";

const SolutionForm = ({
  problemId,
  onSolutionSubmit,
  parentSolutionId = null,
  onCancel,
}) => {
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
      const solutionData = {
        content,
        parentSolution: parentSolutionId,
      };

      const response = await problemService.submitSolution(
        problemId,
        solutionData
      );

      onSolutionSubmit(response.data);
      setContent("");
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit solution.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isReplyForm = !!parentSolutionId;

  return (
    <div
      className={
        isReplyForm ? "mt-4" : "mt-10 bg-white p-8 rounded-lg shadow-md"
      }
    >
      {!isReplyForm && (
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Submit Your Solution or Comment
        </h3>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows={isReplyForm ? "3" : "5"}
          placeholder={
            isReplyForm
              ? "Write a reply..."
              : "Share your thoughts, suggestions, or a complete solution..."
          }
          required
        ></textarea>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="flex items-center gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : isReplyForm ? "Post Reply" : "Submit"}
          </button>
          {isReplyForm && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SolutionForm;
