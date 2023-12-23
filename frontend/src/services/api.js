import axios from "axios";
import { getLocalRefreshToken } from "../utils";

const BASE_URL = "http://localhost:8000/api/";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
});

export async function getToken(login, password) {
  try {
    const response = await instance.post("token/", {
      email: login,
      password: password,
    });
    localStorage.setItem("auth_data", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function refreshToken() {
  try {
    const refreshToken = getLocalRefreshToken();
    const response = await instance.post("token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem("auth_data", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}
