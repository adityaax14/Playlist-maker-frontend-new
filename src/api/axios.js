import axios from "axios";

// axiosInstance.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v2",
  withCredentials: true
});