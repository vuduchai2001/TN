import { apiConfig } from "@/configs/api.config";
import { getToken, setToken } from "@/utils/auth";
import axios from "axios";
import { refreshToken } from "./auth";

export const request = () => {
  const token = getToken();

  const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: { "X-Custom-Header": "Ha1" },
  });

  if (token && token.accessToken) {
    instance.defaults.headers.common["Authorization"] =
      "Bearer " + token.accessToken;
    instance.interceptors.response.use(
      (res) => {
        return res;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const { data } = await refreshToken(token.refreshToken ?? "");
          setToken(data);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data?.accessToken ?? "";
          return instance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
  }
  return instance;
};
