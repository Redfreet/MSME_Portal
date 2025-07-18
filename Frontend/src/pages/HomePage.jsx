import { useState, useEffect } from "react";
import problemService from "../api/problemService.api.js";
import ProblemCard from "../components/Problemcard";

const HomePage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await problemService.getAllProblems();
        setProblems(response.data);
      } catch (err) {
        setError("Failed to fetch problems. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading problems...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">Open Problems</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {problems.length > 0 ? (
          problems.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No problems have been posted yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
