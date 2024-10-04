import axios from "axios";
import API from "@/api/endpoints";

export async function handleLogin(data) {
  return await axios.post(API.LOGIN_URL, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
}
