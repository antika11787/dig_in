import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialContentState {
  contentLength: number;
}

const initialState: InitialContentState = {
  contentLength: 0,
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    saveContentLength: (
      state,
      action: PayloadAction<{ contentLength: number }>
    ) => {
      state.contentLength = action.payload.contentLength;
    },
  },
});

export const { saveContentLength } = contentSlice.actions;

export default contentSlice.reducer;
