import { getToken, removeToken } from "@/utils/auth";
import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { actionAuthLogin, actionGetUsers } from "./authAction";
import { logout } from "@/services/auth";

const userToken = getToken();

type IAuthState = {
  loading: boolean;
  isLogin: boolean;
  error: API.ErrorResponse<null> | null;
  success: boolean;
  user: any;
};
const initialState: IAuthState = {
  loading: false,
  isLogin: !!userToken,
  error: null,
  success: false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    actionAuthLogout: (state) => {
      const auth = getToken();
      logout(auth?.accessToken ?? "", auth?.refreshToken ?? "");
      removeToken();
      state.isLogin = false;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<IAuthState>) => {
    builder
      .addCase(actionAuthLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionAuthLogin.fulfilled, (state) => {
        state.loading = false;
        state.isLogin = true;
      })
      .addCase(actionAuthLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as API.ErrorResponse<null>;
      })
      .addCase(actionGetUsers.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { actionAuthLogout } = authSlice.actions;

export default authSlice.reducer;
