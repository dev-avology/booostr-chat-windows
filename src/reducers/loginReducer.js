import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetAllStates } from "./resetSlice";
import axios from "axios";
import { CHAT_API_URL } from "../config";

const initialState = {
  isLoggedIn: false,
  CurrentUserID: null,
  userData: null,
  loading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.isLoggedIn = false;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.userData = action.payload;
      state.error = false;
    },
    loginError: (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.error = true;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    CurrentUserRequest: (state) => {
      state.loading = true;
      state.error = false;
    },
    CurrentUserSuccess: (state, action) => {
      state.userData = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
    },
    CurrentUserError: (state) => {
      state.loading = false;
      state.error = true;
    },
    setCurrentUseData: (state, action) => {
      state.loading = false;
      state.CurrentUserID = action.payload;
      state.error = true;
    },
    resetLogin: (state, action) => {
      state.isLoggedIn = false,
      state.CurrentUserID = null,
      state.userData = null,
      state.loading = false,
      state.error = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllStates, (state) => {
      return { ...initialState };
    });
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginError,
  CurrentUserRequest,
  CurrentUserSuccess,
  CurrentUserError,
  setCurrentUseData,
  resetLogin,
  logoutRequest
} = authSlice.actions;

export const fetchUserData = (userId) => async (dispatch) => {
  try {
    dispatch(CurrentUserRequest());
    const response = await axios.get(
      `${CHAT_API_URL}/chat_get_user_info?user_id=${userId}`
    );
    dispatch(CurrentUserSuccess(JSON.stringify(response.data)));
  } catch (error) {
    dispatch(CurrentUserError());
  }
};

export default authSlice.reducer;
