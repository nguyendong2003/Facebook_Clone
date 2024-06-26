import createDataContext from "./createDataContext";
import SpringServer from "../api/SpringServer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, token: action.payload };
    case "ERROR":
      return { ...state, errorMessage: action.payload };
    case "SIGN_OUT":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const signIn = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const response = await SpringServer.post("/auth/login", {
        username: email,
        password,
      });
      
      await AsyncStorage.setItem("token", response.data.token);

      dispatch({ type: "SIGN_IN", payload: response.data.token });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: "Something went wrong with sign in",
      });
      Alert.alert("Error", "Something went wrong with sign in");
    }
  };
};

const checkLoggedIn = (dispatch) => {
  return async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      isExpired = await SpringServer.get(`/auth/checkTokenExpired?token=${token}`);

      if (!isExpired.data) dispatch({ type: "SIGN_IN", payload: token });
    }
  };
};

const register = (dispatch) => {
  return async ({
    email,
    username,
    password,
    dateOfBirth,
    gender,
    fullName,
  }) => {
    try {
      gender = gender == "male" ? true : false;
      const response = await SpringServer.post("/auth/register", {
        username,
        password,
        email,
        date_of_birth: dateOfBirth,
        gender,
        full_name: fullName,
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: "Something went wrong with sign up",
      });
      Alert.alert("Error", "Something went wrong with up");
    }
  };
};
const logout = (dispatch) => {
  return async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "SIGN_OUT" });
  };
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { signIn, checkLoggedIn, register, logout },
  { token: null, errorMessage: "" }
);
