import { useState, useEffect } from "react";
import problemService from "../api/problemService.api.js";
import ProblemCard from "../components/Problemcard";

const HomePage = () => {
  const [openProblems, setOpenProblems] = useState([]);
  const [closedProblems, setClosedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await problemService.getAllIndustries();
        setIndustries(response.data || []);
      } catch (err) {
        console.error("Failed to fetch industries:", err);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const fetchProblems = async () => {
        setLoading(true);
        try {
          const params = {};
          if (selectedIndustry) {
            params.industry = selectedIndustry;
          }
          if (searchTerm) {
            params.search = searchTerm;
          }
          if (selectedUrgency) {
            params.urgency = selectedUrgency;
          }
          if (selectedRegion) {
            params.region = selectedRegion;
          }

          const response = await problemService.getAllProblems(params);
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
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [selectedIndustry, searchTerm, selectedUrgency, selectedRegion]);

  const handleClearFilters = () => {
    setSelectedIndustry(null);
    setSelectedUrgency(null);
    setSelectedRegion("");
    setSearchTerm("");
  };

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div className="font-mono flex flex-col md:flex-row gap-8">
      {/* --- Sidebar for Industry Filtering --- */}
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-24 space-y-6">
          {/* Industry Filter */}
          <div>
            <h2 className="text-lg font-bold mb-2 border-b pb-2">Industries</h2>
            <ul>
              <li
                onClick={() => setSelectedIndustry(null)}
                className={`p-2 rounded-md cursor-pointer ${
                  !selectedIndustry
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                All Industries
              </li>
              {industries.map((industry) => (
                <li
                  key={industry._id}
                  onClick={() => setSelectedIndustry(industry.name)}
                  className={`p-2 mt-1 rounded-md cursor-pointer capitalize ${
                    selectedIndustry === industry.name
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {industry.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Urgency Filter */}
          <div>
            <h2 className="text-lg font-bold mb-2 border-b pb-2">Urgency</h2>
            <ul>
              {["High", "Medium", "Low"].map((level) => (
                <li
                  key={level}
                  onClick={() => setSelectedUrgency(level)}
                  className={`p-2 mt-1 rounded-md cursor-pointer ${
                    selectedUrgency === level
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {level}
                </li>
              ))}
            </ul>
          </div>

          {/* Region Filter */}
          <div>
            <h2 className="text-lg font-bold mb-2 border-b pb-2">Region</h2>
            <input
              type="text"
              placeholder="Filter by region..."
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <button
              onClick={handleClearFilters}
              className="w-full p-2 mt-4 text-sm text-center text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </aside>

      <main className="w-full md:w-3/4 lg:w-4/5">
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading problems...</p>
        ) : (
          <>
            {/* Open Problems Section */}
            <h1 className="text-3xl font-bold mb-4">Open Problems</h1>
            <div className="space-y-6">
              {openProblems.length > 0 ? (
                openProblems.map((problem) => (
                  <ProblemCard key={problem._id} problem={problem} />
                ))
              ) : (
                <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md">
                  No open problems match your criteria.
                </p>
              )}
            </div>

            {/* Closed Problems Section */}
            {closedProblems.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-600">
                  Closed Problems
                </h2>
                <div className="space-y-6">
                  {closedProblems.map((problem) => (
                    <ProblemCard
                      key={problem._id}
                      problem={problem}
                      isClosed={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
