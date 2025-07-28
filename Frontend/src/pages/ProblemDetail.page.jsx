import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import problemService from "../api/problemService.api.js";
import { useAuth } from "../context/AuthContent";
import SolutionForm from "../components/SolutionForm";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { authUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  //update on submitting new sol
  const handleNewSolution = (newSolution) => {
    const populatedSolution = {
      ...newSolution,
      collaboratorId: {
        _id: authUser._id,
        fullName: authUser.fullName,
      },
      upvotes: [],
    };
    setSolutions([populatedSolution, ...solutions]);
  };

  //FUNCTION TO HANDLE UPVOTING
  const handleUpvote = async (solutionId) => {
    if (!authUser) {
      alert("Please log in to upvote.");
      return;
    }
    try {
      const response = await problemService.upvoteSolution(solutionId);
      const updatedSolution = response.data;

      setSolutions(
        solutions.map((s) => (s._id === solutionId ? updatedSolution : s))
      );
    } catch (err) {
      console.error("Failed to upvote solution:", err);
      alert("There was an error processing your vote.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-8">Loading details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <p className="text-sm text-gray-500 font-semibold">
          {problem.companyId?.fullName}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mt-2">
          {problem.title}
        </h1>
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
        <div className="prose max-w-none mt-6">
          <p>{problem.description}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Solutions & Discussion
        </h2>
        <div className="space-y-6">
          {solutions.length > 0 ? (
            solutions.map((solution) => {
              // --- THIS VARIABLE WAS MISSING ---
              const isUpvoted =
                authUser && solution.upvotes.includes(authUser._id);
              return (
                <div
                  key={solution._id}
                  className="border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <p className="font-bold text-gray-800">
                        {solution.collaboratorId?.fullName}
                      </p>
                      <span className="text-xs text-gray-500 mx-2">•</span>
                      <p className="text-xs text-gray-500">
                        {new Date(solution.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* --- THIS BUTTON WAS CORRECTED --- */}
                    <button
                      onClick={() => handleUpvote(solution._id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                        isUpvoted
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      disabled={!authUser}
                    >
                      <span>👍</span>
                      <span>{solution.upvotes.length}</span>
                    </button>
                  </div>
                  <p className="text-gray-700">{solution.content}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">
              No solutions have been submitted yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      {authUser && (
        <SolutionForm problemId={id} onSolutionSubmit={handleNewSolution} />
      )}
    </div>
  );
};

export default ProblemDetailPage;
