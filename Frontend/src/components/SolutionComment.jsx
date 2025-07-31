import React, { useState } from "react";
import { useAuth } from "../context/AuthContent";
import SolutionForm from "./SolutionForm";

const SolutionComment = ({ solution, problemId, onUpvote, onReplySubmit }) => {
  const { authUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isUpvoted = authUser && solution.upvotes?.includes(authUser._id);

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    onReplySubmit();
  };
  return (
    <div className="flex">
      {/* Vertical line for nesting */}
      <div className="mr-4 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="w-px h-full bg-gray-300"></div>
      </div>

      {/* Comment Content */}
      <div className="flex-1">
        <div className="bg-gray-50 p-4 rounded-lg">
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
              onClick={() => onUpvote(solution._id)}
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
          <div className="mt-4">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Reply
            </button>
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
        {solution.replies && solution.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {solution.replies.map((reply) => (
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
