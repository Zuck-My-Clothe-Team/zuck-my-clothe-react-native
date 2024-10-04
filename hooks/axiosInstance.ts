import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const accessToken = AsyncStorage.getItem("accessToken");

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Origin: process.env.EXPO_PUBLIC_FRONTEND_URL,
  },
});
