// src/api/client.ts
import axios, { AxiosInstance } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import ENV from "./ENV";

const baseURL =
  import.meta.env.MODE === "development" ? ENV.nodeURL : ENV.backendURL;

const Client: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach JWT token
Client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("blogToken");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, any>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
// Client.interceptors.response.use(
//   (res: AxiosResponse) => res,
//   (err: any) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("blogToken");
//       localStorage.removeItem("blogUser");
//       window.location.href = "/admin/login";
//     }
//     return Promise.reject(err);
//   }
// );

export default Client;
