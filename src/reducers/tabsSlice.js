import { createSlice } from '@reduxjs/toolkit';

const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabIndex: "Direct Chat", // Initialize the active tab index
  },
  reducers: {
    setTabIndex: (state, action) => {
      state.tabIndex = action.payload;
    },
  },
});

export const { setTabIndex } = tabsSlice.actions;
export default tabsSlice.reducer;