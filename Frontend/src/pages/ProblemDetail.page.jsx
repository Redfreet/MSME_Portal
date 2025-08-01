import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import problemService from "../api/problemService.api.js";
import { useAuth } from "../context/AuthContent";
import SolutionForm from "../components/SolutionForm";
import SolutionComment from "../components/SolutionComment";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { authUser } = useAuth();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isNaradaThinking, setIsNaradaThinking] = useState(false);

  const fetchSolutions = async () => {
    try {
      const solutionsRes = await problemService.getSolutionsForProblem(id);
      setSolutions(solutionsRes.data);
    } catch (err) {
      console.error("Failed to refetch solutions:", err);
      setError("Could not update the solution list.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemRes, solutionsRes] = await Promise.all([
          problemService.getProblemById(id),
          problemService.getSolutionsForProblem(id),
        ]);
        setProblem(problemRes.data);
        setSolutions(solutionsRes.data);
      } catch (err) {
        setError("Failed to load problem details. It may not exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNewSolution = (newSolution) => {
    fetchSolutions();

    if (newSolution && newSolution.content) {
      const isNaradaMentioned = newSolution.content
        .toLowerCase()
        .includes("@narada");

      if (isNaradaMentioned) {
        setIsNaradaThinking(true);
        console.log("Narada mentioned. Waiting for AI summary...");

        setTimeout(() => {
          fetchSolutions();
          setIsNaradaThinking(false);
        }, 5000);
      }
    }
  };

  //FUNCTION TO HANDLE UPVOTING
  const handleUpvote = async (solutionId) => {
    if (!authUser) {
      alert("Please log in to upvote.");
      return;
    }
    try {
      await problemService.upvoteSolution(solutionId);
      fetchSolutions();
    } catch (err) {
      console.error("Failed to upvote solution:", err);
      alert("There was an error processing your vote.");
    }
  };

  const handleCloseProblem = async () => {
    if (
      !window.confirm(
        "Are you sure you want to close this problem? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsUpdatingStatus(true);
    try {
      const updatedProblem = await problemService.updateProblemStatus(
        id,
        "Closed"
      );
      // Update the local state to immediately reflect the change
      setProblem(updatedProblem.data);
    } catch (err) {
      console.error("Failed to close problem:", err);
      alert("There was an error closing the problem.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-8">Loading details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  if (!problem) {
    return <p className="text-center text-gray-500 mt-8">Problem not found.</p>;
  }
  const isOwner = authUser && authUser._id === problem.companyId?._id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start gap-1">
          <div className="flex-grow mr-4">
            <p className="text-sm text-gray-500 font-semibold">
              {problem.companyId?.companyName
                ? `${problem.companyId.companyName} (${problem.companyId.fullName})`
                : problem.companyId?.fullName || "A Company"}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">
              {problem.title}
            </h1>
          </div>

          {/* Show button only if user is owner and problem is open */}
          {isOwner && problem.status === "Open" && (
            <>
              <Link
                to={`/problem/${problem._id}/edit`}
                className="uppercase border border-gray-700 hover:border-blue-800 hover:text-blue-700 px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-base  disabled:bg-blue-300"
              >
                Edit
              </Link>
              <button
                onClick={handleCloseProblem}
                disabled={isUpdatingStatus}
                className="uppercase border border-gray-700 hover:border-red-800 hover:text-red-700 px-5 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 text-base disabled:bg-red-300"
              >
                {isUpdatingStatus ? "Closing..." : "Close"}
              </button>
            </>
          )}
          {/* Show a badge if the problem is closed */}
          {problem.status !== "Open" && (
            <span className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full">
              {problem.status}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 my-4">
          {problem.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <pre className="whitespace-pre-wrap text-gray-800 mb-4">
          {problem.description}
        </pre>

        {problem.attachmentUrl && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Attachment</h3>
            <img
              src={problem.attachmentUrl}
              alt="Problem Attachment"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="flex justify-center text-3xl font-bold text-gray-900 mb-6">
          Solutions & Discussion
        </h2>
        {isNaradaThinking && (
          <div
            className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg"
            role="alert"
          >
            <span className="font-medium">Narada is thinking...</span> A summary
            of the discussion will appear shortly.
          </div>
        )}
        <div className="space-y-6">
          {solutions.length > 0 ? (
            solutions.map((solution) => (
              <SolutionComment
                key={solution._id}
                solution={solution}
                problemId={id}
                onReplySubmit={handleNewSolution}
                onUpvote={handleUpvote}
              />
            ))
          ) : (
            <p className="text-gray-500">
              No solutions have been submitted yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      {authUser && problem.status === "Open" && (
        <div className="mt-8">
          <SolutionForm problemId={id} onSolutionSubmit={handleNewSolution} />
        </div>
      )}
    </div>
  );
};

export default ProblemDetailPage;
