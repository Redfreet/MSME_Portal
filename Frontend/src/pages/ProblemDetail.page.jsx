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

  // --- 2. Updated useEffect for auto-scrolling ---
  useEffect(() => {
    // Only run this logic after the data has finished loading and solutions are populated
    if (!loading && location.hash && solutions.length > 0) {
      try {
        const elementId = location.hash.substring(1);
        const element = document.getElementById(elementId);

        if (element) {
          // A short timeout can help ensure the DOM is fully painted before scrolling
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.style.backgroundColor = "#f0f8ff"; // Highlight effect
            setTimeout(() => {
              element.style.backgroundColor = ""; // Remove highlight
            }, 2000);
          }, 100); // Small delay of 100ms
        }
      } catch (e) {
        console.error("Failed to scroll to element:", e);
      }
    }
  }, [loading, location.hash, solutions]);

  //update on submitting new sol
  const handleNewSolution = (newSolution) => {
    const populatedSolution = {
      ...newSolution,
      collaboratorId: {
        _id: authUser._id,
        fullName: authUser.fullName,
      },
    };
    setSolutions([populatedSolution, ...solutions]);
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
            solutions.map((solution) => (
              <div key={solution._id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <p className="font-bold text-gray-800">
                    {solution.collaboratorId?.fullName}
                  </p>
                  <span className="text-xs text-gray-500 mx-2">•</span>
                  <p className="text-xs text-gray-500">
                    {new Date(solution.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{solution.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No solutions have been submitted yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>

      {/*add a form to submit a new solution here */}
      {authUser && (
        <SolutionForm problemId={id} onSolutionSubmit={handleNewSolution} />
      )}
    </div>
  );
};

export default ProblemDetailPage;
