import { useState, useEffect } from "react";
import problemService from "../api/problemService.api.js";
import ProblemCard from "../components/Problemcard";

const HomePage = () => {
  const [openProblems, setOpenProblems] = useState([]);
  const [closedProblems, setClosedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await problemService.getAllProblems();
        const { openProblems, closedProblems } = response.data;
        setOpenProblems(openProblems || []);
        setClosedProblems(closedProblems || []);
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
      {/* --- Section for Open Problems --- */}
      <h1 className="text-4xl font-bold text-center mb-8">Open Problems</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {openProblems.length > 0 ? (
          openProblems.map((problem) => (
            <ProblemCard key={problem._id} problem={problem} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            There are no open problems at the moment.
          </p>
        )}
      </div>

      {/* --- Section for Closed Problems --- */}
      {closedProblems.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-600">
            Closed Problems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {closedProblems.map((problem) => (
              // We pass an `isClosed` prop to style the card differently
              <ProblemCard
                key={problem._id}
                problem={problem}
                isClosed={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
