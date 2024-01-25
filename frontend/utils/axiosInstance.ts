import axios from "axios";

interface CustomImportMeta extends ImportMeta {
  env: {
    VITE_SERVER_URL: string;
  };
}

const axiosInstance = axios.create({
  baseURL: (import.meta as CustomImportMeta).env.VITE_SERVER_URL,
  timeout: 10000,
});

const axiosInstanceToken = axios.create({
  baseURL: (import.meta as CustomImportMeta).env.VITE_SERVER_URL,
  timeout: 10000,
});

axiosInstanceToken.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosInstance, axiosInstanceToken };
