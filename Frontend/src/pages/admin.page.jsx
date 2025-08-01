import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import problemService from "../api/problemService.api.js";
import { FaEdit, FaTrashAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AdminPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedProblemId, setExpandedProblemId] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);

  const fetchAllProblems = async () => {
    try {
      setLoading(true);
      const response = await problemService.getAllProblemsAdmin();
      setProblems(response.data || []);
    } catch (err) {
      console.error("Failed to fetch problems for admin panel:", err);
      setError("Failed to load problems. You may not have admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProblems();
  }, []);

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await problemService.deleteProblemAdmin(problemId);
        setProblems(problems.filter((problem) => problem._id !== problemId));
        // console.log("Problem deleted successfully.");
      } catch (err) {
        console.error("Failed to delete problem:", err);
        alert("Failed to delete the problem. Please try again.");
      }
    }
  };

  const handleEditProblem = (problem) => {
    setEditingProblem(problem);
  };

  const handleUpdateProblem = async (e) => {
    e.preventDefault();
    try {
      await problemService.updateProblemAdmin(editingProblem._id, {
        status: editingProblem.status,
        tags: editingProblem.tags,
        title: editingProblem.title,
        description: editingProblem.description,
        skills_needed: editingProblem.skills_needed,
        urgency: editingProblem.urgency,
        region: editingProblem.region,
      });

      await fetchAllProblems();
      setEditingProblem(null);
      alert("Problem updated successfully.");
    } catch (err) {
      console.error("Failed to update problem:", err);
      alert("Failed to update the problem.");
    }
  };

  const handleDeleteComment = async (solutionId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await problemService.deleteCommentAdmin(solutionId, commentId);
        alert("Comment deleted successfully.");
        fetchAllProblems();
      } catch (err) {
        console.error("Failed to delete comment:", err);
        alert("Failed to delete the comment.");
      }
    }
  };

  const toggleSolutionsView = async (problemId) => {
    if (expandedProblemId === problemId) {
      setExpandedProblemId(null);
      return;
    }
    try {
      const response = await problemService.getSolutionsAdmin(problemId);
      const updatedProblems = problems.map((p) =>
        p._id === problemId ? { ...p, solutions: response.data } : p
      );
      setProblems(updatedProblems);
      setExpandedProblemId(problemId);
    } catch (err) {
      console.error("Failed to fetch solutions:", err);
      setError("Failed to load solutions.");
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading Admin Panel...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Admin Panel - All Problems
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Urgency
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => (
                <React.Fragment key={problem._id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {problem.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-600">
                        {problem.companyId?.companyName ||
                          problem.companyId?.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          problem.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {problem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {problem.urgency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center justify-center space-x-2">
                      <button
                        onClick={() => toggleSolutionsView(problem._id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {expandedProblemId === problem._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                      <Link
                        to={`/admin/problem/edit/${problem._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeleteProblem(problem._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                  {/* Expanded row for solutions */}
                  {expandedProblemId === problem._id && problem.solutions && (
                    <tr>
                      <td colSpan="5" className="bg-gray-100 p-4">
                        <h4 className="font-bold text-gray-800 mb-2">
                          Solutions:
                        </h4>
                        {problem.solutions.length > 0 ? (
                          <ul className="space-y-4">
                            {problem.solutions.map((solution) => (
                              <li
                                key={solution._id}
                                className="p-3 bg-white rounded-md shadow-sm"
                              >
                                <p className="text-sm text-gray-700">
                                  {solution.description}
                                </p>
                                {solution.comments &&
                                  solution.comments.length > 0 && (
                                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                      <h5 className="font-semibold text-gray-600">
                                        Comments:
                                      </h5>
                                      {solution.comments.map((comment) => (
                                        <div
                                          key={comment._id}
                                          className="flex justify-between items-center text-sm text-gray-500 mt-1"
                                        >
                                          <span>{comment.text}</span>
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(
                                                solution._id,
                                                comment._id
                                              )
                                            }
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <FaTrashAlt />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No solutions found.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProblem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-2xl font-bold mb-4">
              Edit Problem: {editingProblem.title}
            </h3>
            <form onSubmit={handleUpdateProblem}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  value={editingProblem.status}
                  onChange={(e) =>
                    setEditingProblem({
                      ...editingProblem,
                      status: e.target.value,
                    })
                  }
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Open">Open</option>

                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
