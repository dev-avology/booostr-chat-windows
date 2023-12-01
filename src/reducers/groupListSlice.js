import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAllStates } from "./resetSlice";
import { CHAT_API_URL } from "../config";
const groupSlice = createSlice({
  name: "groups",
  initialState: {
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchGroupListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGroupListSuccess: (state, action) => {
      state.loading = false;
      const parsedPayload = JSON.parse(action.payload);
      if (parsedPayload?.data?.contact_groups) {
        state.groups = parsedPayload.data.contact_groups;
      }
    },
    fetchGroupListFailure: (state, action) => {
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
  fetchGroupListStart,
  fetchGroupListSuccess,
  fetchGroupListFailure,
} = groupSlice.actions;

export const fetchGroupList = (club_id) => async (dispatch) => {
  try {
    dispatch(fetchGroupListStart());
    const response = await axios.get(
      `${CHAT_API_URL}/chat_get_contact_groups?club_id=${club_id}`
    );
    dispatch(fetchGroupListSuccess(JSON.stringify(response.data)));
  } catch (error) {
    dispatch(fetchGroupListFailure(error));
  }
};


export const createGroupConversation = (payload) => async () => {
  try {
    const response = await axios.post(`${CHAT_API_URL}/chat_create_group_conversation`, payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export default groupSlice.reducer;
