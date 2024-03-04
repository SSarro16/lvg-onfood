import { createSlice } from "@reduxjs/toolkit";
import { getAuthToken } from "../util/auth";

type AuthState = {
  token: string | null;
};

type LoginAction = {
  payload: AuthState;
  type: string;
};

const initialAuthState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action: LoginAction) {
      const { token } = action.payload;
      state.token = token;
    },
    logout(state) {
      state.token = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
