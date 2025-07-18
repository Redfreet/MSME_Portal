import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const config = {
  withCredentials: true, //for protected route
};

const getAllProblems = () => {
  return axios.get(`${API_URL}/problems`, config);
};

const getProblemById = (id) => {
  return axios.get(`${API_URL}/problems/${id}`, config);
};

const getSolutionsForProblem = (id) => {
  return axios.get(`${API_URL}/problems/${id}/solutions`, config);
};

const submitSolution = (id, solutionData) => {
  return axios.post(
    `${API_URL}/problems/${id}/solutions`,
    solutionData,
    config
  );
};

const createProblem = (problemData) => {
  return axios.post(`${API_URL}/problems`, problemData, config);
};

const problemService = {
  getAllProblems,
  getProblemById,
  getSolutionsForProblem,
  submitSolution,
  createProblem,
};

export default problemService;
