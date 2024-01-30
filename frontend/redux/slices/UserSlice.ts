import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  token: string;
  isVerified: boolean;
}

const initialState: UserState = {
  email: "",
  token: "",
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
      action: PayloadAction<{ email: string; isVerified: boolean; token: string }>
    ) => {
      console.log("payload", action.payload.email);
      state.email = action.payload.email;
      state.isVerified = action.payload.isVerified;
      state.token = action.payload.token;

      localStorage.setItem("token", action.payload.token);
    },
    removeLogin: (state) => {
      state.email = "";
      state.token = "";
      state.isVerified = false;
    },
  },
});

export const { saveVerification, saveLogin, removeLogin } = userSlice.actions;

export default userSlice.reducer;
