import { parseJson } from "./json";

export const getToken = (): TOKEN.Auth | undefined => {
  const data = localStorage.getItem("auth");
  const auth = parseJson<TOKEN.Auth>(data);
  return auth;
};

export const setToken = (t: TOKEN.Auth) => {
  localStorage.setItem("auth", JSON.stringify(t));
};

export const removeToken = () => {
  localStorage.removeItem("auth");
};

export const decodeJwt = <T>(token: string): T | undefined => {
  return parseJson(atob(token.split(".")[1]));
};
