import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAllStates } from "./resetSlice";
import { CHAT_API_URL } from "../config";
const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchContactListStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchContactListSuccess: (state, action) => {
      state.loading = false;
      const parsedPayload = JSON.parse(action.payload);
      if (parsedPayload?.data?.contacts_lists) {
        state.contacts = parsedPayload.data.contacts_lists;
      }
    },
    fetchContactListFailure: (state, action) => {
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
  fetchContactListStart,
  fetchContactListSuccess,
  fetchContactListFailure,
} = contactSlice.actions;

export const fetchClubContactList = (club_id) => async (dispatch) => {
  try {
    dispatch(fetchContactListStart());
    const response = await axios.get(
      `${CHAT_API_URL}/get_chat_contact_list_in_club?club_id=${club_id}`
    );
    dispatch(fetchContactListSuccess(JSON.stringify(response.data)));
  } catch (error) {
    dispatch(fetchContactListFailure(error));
  }
};

export const fetchUserContactList = (club_id, user_id) => async (dispatch) => {
  try {
    dispatch(fetchContactListStart());
    const requestData = {
      club_id: club_id,
      user_id: user_id,
    };
    const response = await axios.post(
      `${CHAT_API_URL}/chat_user_get_list_of_contacts`,
      requestData
    );
    dispatch(fetchContactListSuccess(JSON.stringify(response.data)));
  } catch (error) {
    dispatch(fetchContactListFailure(error));
  }
};

export const createChatConversation = (payload) => async () => {
    try {
      const response = await axios.post(`${CHAT_API_URL}/chat_custom_create_conversation`, payload);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export default contactSlice.reducer;
