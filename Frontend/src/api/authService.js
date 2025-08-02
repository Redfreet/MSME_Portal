import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// console.log("API URL being used:", API_URL);

const config = {
  withCredentials: true,
};

const signup = (userData) => {
  return axios.post(`${API_URL}/user/signup`, userData, config);
};

const login = (credentials) => {
  return axios.post(`${API_URL}/user/login`, credentials, config);
};

const logout = () => {
  return axios.post(`${API_URL}/user/logout`, {}, config);
};

//current logged-in user's data
const getMe = () => {
  return axios.get(`${API_URL}/user/me`, config);
};

const getActivity = () => {
  return axios.get(`${API_URL}/user/activity`, config);
};

const updateProfile = (profileData) => {
  return axios.put(`${API_URL}/user/profile`, profileData, config);
};

const updateProfilePicture = (formData) => {
  const uploadConfig = {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.put(`${API_URL}/user/profile/picture`, formData, uploadConfig);
};

const authService = {
  signup,
  login,
  logout,
  getMe,
  getActivity,
  updateProfile,
  updateProfilePicture,
};

export default authService;
