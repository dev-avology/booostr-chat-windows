import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CHAT_API_URL } from "../config";
const logIn = async (user) => {
  try {
    console.log(`${CHAT_API_URL}/login`);
    const response = await axios.post(`${CHAT_API_URL}/login`, {
      username: user.username,
      password: user.password,
    });
    
    if (response && response.data) {
      const userdata = response.data;
      if (userdata && userdata !== null && userdata?.user_id) {
        await AsyncStorage.setItem(
          "user_id",
          JSON.stringify(userdata?.user_id)
        );
        return {
          status: "success",
          message: "You are redirecting to the home page",
          userdata: JSON.stringify(userdata),
        };
      } else {
        //console.error("API Error:" + response.data);
        alert(response.data.error);
      }
    } else {
      //console.error("API Error: Response or response.data is undefined");
      alert("Login failed. Please try again later.");
    }
  } catch (error) {
    errormsg = error.response ? error.response.data.message : error.message;
    alert(error);
  } finally {
  }
};

const logOut = async () => {
  AsyncStorage.clear();
  return {
    status: "success",
    message: "You are logged out",
  };
};

const getUserDataById = async (userId) => {
  try {
    const response = await axios.get(
      `${CHAT_API_URL}/chat_get_user_info?user_id=${userId}`
    );
    return {
      status: "success",
      message: "You are redirecting to the home page",
      data: JSON.stringify(response.data),
    };
  } catch (error) {
    throw error;
  }
};

export default {
  logIn,
  logOut,
  getUserDataById,
};
