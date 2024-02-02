import axios from "axios";
import dotenv from "dotenv";
import appConfig from "../config/constants";
dotenv.config();

const axiosInstance = axios.create({
  baseURL: appConfig.nextPublicApiBaseUrl,
  timeout: 10000,
});

const axiosInstanceToken = axios.create({
  baseURL: appConfig.nextPublicApiBaseUrl,
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
