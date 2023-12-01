import { createSlice } from "@reduxjs/toolkit";
import { resetAllStates } from "./resetSlice";
import axios from "axios";
import { CHAT_API_URL } from "../config";
const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchConversationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchConversationsSuccess: (state, action) => {
      state.loading = false;
      state.conversations = action.payload;
    },
    fetchConversationsFailure: (state, action) => {
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
  fetchConversationsStart,
  fetchConversationsSuccess,
  fetchConversationsFailure,
} = conversationSlice.actions;

export const fetchConversationsList = (userId, clubId) => async (dispatch) => {
  try {
    dispatch(fetchConversationsStart());
    const response = await axios.get(
      `${CHAT_API_URL}/chat_get_conversations?user_id=${userId}&club_id=${clubId}`
    );
    dispatch(fetchConversationsSuccess(JSON.stringify(response.data)));
  } catch (error) {
    dispatch(fetchConversationsFailure(error));
  }
};

export default conversationSlice.reducer;
