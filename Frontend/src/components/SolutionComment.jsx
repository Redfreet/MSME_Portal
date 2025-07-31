import { useState } from "react";
import { useAuth } from "../context/AuthContent";
import SolutionForm from "./SolutionForm";
import problemService from "../api/problemService.api.js";

const SolutionComment = ({ solution, problemId, onUpvote, onReplySubmit }) => {
  const { authUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isUpvoted = authUser && solution.upvotes?.includes(authUser._id);
  const hasReplies = solution.replies && solution.replies.length > 0;

  const toggleReplies = () => {
    if (hasReplies) {
      // Only toggle if there are replies
      setIsExpanded(!isExpanded);
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplySubmit();
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this comment and all its replies?"
      )
    ) {
      return;
    }
    try {
      await problemService.deleteSolution(solution._id);
      onReplySubmit(); // Refetch all comments to update the UI
    } catch (err) {
      console.error("Failed to delete solution:", err);
      alert("There was an error deleting this comment.");
    }
  };

  const canDelete =
    authUser &&
    (authUser._id === solution.collaboratorId?._id ||
      authUser.role === "admin");

  return (
    <div className="flex">
      {/* Vertical line for nesting */}
      <div className="mr-4 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="w-px h-full bg-gray-300"></div>
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        <div
          className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          onClick={toggleReplies} // Click to toggle replies
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <p className="font-bold text-gray-800">
                {solution.collaboratorId?.fullName}
                <span className="text-gray-500 font-normal ml-2">
                  @{solution.collaboratorId?.username}
                </span>
              </p>
              {/* --- DATE ADDED BACK --- */}
              <span className="text-xs text-gray-400 mx-2">•</span>
              <p className="text-xs text-gray-400">
                {new Date(solution.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote(solution._id);
              }}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs transition-colors ${
                isUpvoted
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={!authUser}
            >
              <span>👍</span>
              <span>{solution.upvotes?.length || 0}</span>
            </button>
          </div>
          <p className="text-gray-700 mt-2">{solution.content}</p>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReplyForm(!showReplyForm);
              }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Reply
            </button>
            {canDelete && (
              <>
                <span className="text-gray-300">•</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Delete
                </button>
              </>
            )}
            {hasReplies && (
              <span
                className={`ml-auto text-gray-600 text-xl transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              >
                &#9658;
              </span>
            )}
          </div>
        </div>

        {/* Reply Form (conditionally rendered) */}
        {showReplyForm && (
          <div className="mt-4">
            <SolutionForm
              problemId={problemId}
              parentSolutionId={solution._id}
              onSolutionSubmit={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* If this solution has replies, render them using this same component */}
        {hasReplies && (
          <div className={`mt-4 space-y-4 ${isExpanded ? "" : "hidden"}`}>
            {solution.replies.map((reply) => (
              // Recursively render nested SolutionComments for each reply
              <SolutionComment
                key={reply._id}
                solution={reply}
                problemId={problemId}
                onUpvote={onUpvote}
                onReplySubmit={onReplySubmit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionComment;
