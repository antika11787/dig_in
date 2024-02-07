import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialCartState{
    categoryLength: number
}

const initialState: InitialCartState = {
    categoryLength: 0,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    saveCategoryLength: (
      state,
      action: PayloadAction<{ categoryLength: number }>
    ) => {
      state.categoryLength = action.payload.categoryLength;
    },
  },
});

export const {saveCategoryLength} = categorySlice.actions;

export default categorySlice.reducer;
