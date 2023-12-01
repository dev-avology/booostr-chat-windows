import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAllStates } from "./resetSlice";
import { CHAT_API_URL } from "../config";
const clubSlice = createSlice({
  name: "clubs",
  initialState: {
    clubs: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchClubListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClubListSuccess: (state, action) => {
      state.loading = false;
      state.clubs = action.payload;
    },
    fetchClubListFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllStates, (state) => {
      return { ...initialState };
    });
  },
});

export const {
  fetchClubListStart,
  fetchClubListSuccess,
  fetchClubListFailure,
} = clubSlice.actions;

export const fetchClubList = (userId) => async (dispatch) => {
  try {
    dispatch(fetchClubListStart());
    const response = await axios.get(
      `${CHAT_API_URL}/get_club_list?user_id=${userId}`
    );
    dispatch(fetchClubListSuccess(JSON.stringify(response.data)));
  } catch (error) {
    dispatch(fetchClubListFailure(error));
  }
};

export default clubSlice.reducer;
