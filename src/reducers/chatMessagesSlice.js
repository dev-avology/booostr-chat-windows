import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetAllStates } from "./resetSlice";
import { CHAT_API_URL } from "../config";
const chatMessagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchUserMessagesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserMessagesSuccess: (state, action) => {
      state.loading = false;
      const parsedPayload = JSON.parse(action.payload);
      if (parsedPayload?.data?.messages) {
        state.messages = parsedPayload.data.messages;
      }
    },
    fetchUserMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllStates, (state) => {
      return { ...initialState };
    });
  },
});

export const {
  fetchUserMessagesStart,
  fetchUserMessagesSuccess,
  fetchUserMessagesFailure,
  addMessage,
} = chatMessagesSlice.actions;

export const fetchUserMessages =
  (conversationId, userId) => async (dispatch) => {
    try {
      dispatch(fetchUserMessagesStart());

      const requestData = {
        id: conversationId,
        user_id: userId,
      };

      const response = await axios.post(
        `${CHAT_API_URL}/chat_get_conversation_messages`,
        requestData
      );
      dispatch(fetchUserMessagesSuccess(JSON.stringify(response.data)));
    } catch (error) {
      dispatch(fetchUserMessagesFailure(error));
    }
  };

export const autofetchUserMessages =
  (conversationId, userId) => async (dispatch) => {
    try {
      const requestData = {
        id: conversationId,
        user_id: userId,
      };

      const response = await axios.post(
        `${CHAT_API_URL}/chat_get_conversation_messages`,
        requestData
      );
      dispatch(fetchUserMessagesSuccess(JSON.stringify(response.data)));
    } catch (error) {
      dispatch(fetchUserMessagesFailure(error));
    }
  };

export const sendMessage = (payload) => async () => {
  try {
    const response = await axios.post(
      `${CHAT_API_URL}/chat_send_text_message`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const sendFileMessage = (payload, result, recipientIds) => async () => {
  try {
    const formData = new FormData();
    const parts = result?.assets[0]?.uri.split('/');
  const fileName = parts[parts.length - 1];
    formData.append('file', {
      uri: result?.assets[0]?.uri,
      type: 'image/png',
      name: fileName,
    });
    // Append the payload as form data
    for (const key in payload) {
      formData.append(key, payload[key]);
    }

    recipientIds.forEach((recipientId) => {
      formData.append('recipient_ids[]', recipientId);
    });

    const response = await axios.post(
      `${CHAT_API_URL}/chat_send_file_message`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error message:', error.message);
    }
    console.error('Config:', error.config);
  }
};

export default chatMessagesSlice.reducer;
