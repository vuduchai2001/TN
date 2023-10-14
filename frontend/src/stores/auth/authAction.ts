import { getUsers, login } from "@/services/auth";
import { setToken } from "@/utils/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const actionAuthLogin = createAsyncThunk(
  "auth/login",
  async (payload: API.LoginReq, { rejectWithValue }) => {
    try {
      const { data } = await login(payload);
      setToken(data);
    } catch (e) {
      const error = e as AxiosError<API.ErrorResponse<null>>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const actionGetUsers = createAsyncThunk(
  "user/findAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getUsers();
      return data;
    } catch (e) {
      const error = e as AxiosError<API.ErrorResponse<null>>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
