import { createSlice } from "@reduxjs/toolkit";

const initialState = false; // Define initial state separately

const resetSlice = createSlice({
  name: "reset",
  initialState, // Use the initial state variable here
  reducers: {
    resetAllStates: (state) => {
      return true;
    },
  },
});

export const { resetAllStates } = resetSlice.actions;
export default resetSlice.reducer;