import { AxiosResponse } from "axios";
import { request } from "../base.service";

export const login = async (
  payload: API.LoginReq
): Promise<AxiosResponse<TOKEN.Auth>> => {
  return request().post("/auth/login", payload);
};

export const refreshToken = async (
  refreshToken: string
): Promise<AxiosResponse<TOKEN.Auth>> => {
  return request().post("/auth/refresh", { refreshToken });
};

export async function logout(
  accessToken: string,
  refreshToken: string
): Promise<AxiosResponse<API.SuccessResponse>> {
  return request().delete("/auth/logout", {
    data: {
      accessToken,
      refreshToken,
    },
  });
}

export const getUsers = async (): Promise<AxiosResponse> => {
  return request().get("/users");
};
