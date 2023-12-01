import {
  loginSuccess,
  loginError,
  loginRequest,
} from "../reducers/loginReducer";
import { resetAllStates } from "../reducers/resetSlice";
import AuthService from "../api";

export const login = (user) => (dispatch) => {
  dispatch(loginRequest());
  return AuthService.logIn(user)
    .then(
      (response) => {
        if (response.status === "success") {
          let userdata = response.userdata;
          dispatch(loginSuccess(userdata));
          Promise.resolve();
          return response;
        }
      },
      (error) => {
        const message = error.toString();
        dispatch(loginError());
        Promise.reject();
        return message;
      }
    )
    .catch((err) => {
      dispatch(loginError());
      reject(err);
    });
};
export const logout = () => (dispatch) => {
  return AuthService.logOut().then((response) => {
    if (response.status === "success") {
      dispatch(resetAllStates());
      Promise.resolve();
      return response;
    }
  });
};

export const getUserData = (user_id) => (dispatch) => {
  return AuthService.getUserDataById(user_id).then((response) => {
    if (response.status === "success") {
      Promise.resolve();
      return response;
    }
  });
};
