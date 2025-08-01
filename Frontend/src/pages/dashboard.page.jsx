import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import problemService from "../api/problemService.api.js";
import { FaComments, FaThumbsUp, FaChartBar } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await problemService.getDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-8 text-gray-500">Loading Dashboard...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaComments className="mr-3 text-blue-500" />
            Most Active Problems
          </h2>
          <ul className="space-y-4">
            {dashboardData?.mostActiveProblems?.map((problem) => (
              <li key={problem._id} className="border-b pb-2">
                <Link
                  to={`/problem/${problem._id}`}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {problem.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {problem.commentCount} comments
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaThumbsUp className="mr-3 text-green-500" />
            Most Popular Solutions
          </h2>
          <ul className="space-y-4">
            {dashboardData?.mostPopularSolutions?.map((solution) => (
              <li key={solution._id} className="border-b pb-2">
                <p className="text-sm text-gray-700 truncate">
                  {solution.content}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-green-600 font-bold">
                    {solution.upvoteCount} upvotes
                  </span>
                  <Link
                    to={`/problem/${solution.problemId}`}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View Problem
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaChartBar className="mr-3 text-purple-500" />
            Open Problems by Industry
          </h2>
          <div className="mt-4" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={dashboardData?.problemsByIndustry}
                margin={{
                  top: 5,
                  right: 20,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Problems" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
