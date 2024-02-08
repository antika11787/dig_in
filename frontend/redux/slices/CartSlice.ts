import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialCartState {
  numberOfItems: number;
}

const initialState: InitialCartState = {
  numberOfItems: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    saveNumberOfItems: (
      state,
      action: PayloadAction<{ numberOfItems: number }>
    ) => {
      state.numberOfItems = action.payload.numberOfItems;
    },
  },
});

export const { saveNumberOfItems } = cartSlice.actions;

export default cartSlice.reducer;
