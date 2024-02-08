import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../../types/interfaces";

const initialState: UserState = {
  email: "",
  token: "",
  role: "",
  isVerified: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveVerification: (
      state,
      action: PayloadAction<{ isVerified: boolean }>
    ) => {
      state.isVerified = action.payload.isVerified;
    },
    saveLogin: (
      state,
      action: PayloadAction<{
        email: string;
        isVerified: boolean;
        token: string;
        role: string;
      }>
    ) => {
      console.log("payload", action.payload.email);
      state.email = action.payload.email;
      state.isVerified = action.payload.isVerified;
      state.token = action.payload.token;
      state.role = action.payload.role;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    },
    removeLogin: (state) => {
      state.email = "";
      state.token = "";
      state.role = "";
      state.isVerified = false;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { saveVerification, saveLogin, removeLogin } = userSlice.actions;

export default userSlice.reducer;
