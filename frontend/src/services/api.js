import axios from "axios";

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
  } catch (error) {
    throw new Error(error);
  }
}
