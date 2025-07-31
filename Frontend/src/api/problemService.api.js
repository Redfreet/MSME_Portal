import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const config = {
  withCredentials: true,
};

const getAllProblems = (params = {}) => {
  return axios.get(`${API_URL}/problems`, { ...config, params });
};

const getProblemById = (id) => {
  return axios.get(`${API_URL}/problems/${id}`, config);
};

const getSolutionsForProblem = (problemId) => {
  return axios.get(`${API_URL}/solutions/problem/${problemId}`, config);
};

const submitSolution = (problemId, solutionData) => {
  return axios.post(
    `${API_URL}/solutions/problem/${problemId}`,
    solutionData,
    config
  );
};

const createProblem = (problemData) => {
  return axios.post(`${API_URL}/problems`, problemData, config);
};

const upvoteSolution = (solutionId) => {
  return axios.put(`${API_URL}/solutions/${solutionId}/upvote`, {}, config);
};

const updateProblemStatus = (problemId, status) => {
  return axios.put(
    `${API_URL}/problems/${problemId}/status`,
    { status },
    config
  );
};

const getAllIndustries = () => {
  return axios.get(`${API_URL}/industries`, config);
};

const getAllTags = () => {
  return axios.get(`${API_URL}/problems/tags`, config);
};

const problemService = {
  getAllProblems,
  getProblemById,
  getSolutionsForProblem,
  submitSolution,
  createProblem,
  upvoteSolution,
  updateProblemStatus,
  getAllIndustries,
  getAllTags,
};

export default problemService;
