import axios from "axios";
import { isLoggedIn as getToken } from "./checkAuth";

export const networkCall = async (method, url, body, isTokenRequired = false, params = {}) => {
  try {
    const config = {
      method,
      url,
      data: body,
      headers: {
        Authorization: isTokenRequired ? `Bearer ${getToken(true)}` : "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      params,
    };
    const response = await axios.request(config);
    return response;
  } catch (error) {
    console.log(error);
    if (error.status === 401) {
      localStorage.clear();
    }
    return error;
  }
};
