import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const config = {
  withCredentials: true,
};

const getAllIndustries = () => {
  return axios.get(`${API_URL}/industries`, config);
};

const industryService = {
  getAllIndustries,
};

export default industryService;
