import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosInstance = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return axios.create({
      baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
      timeout: 5000,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        origin: process.env.EXPO_PUBLIC_FRONTEND_URL,
      },
    });
  } catch (error) {
    console.error("Error creating axios instance:", error);
    throw error;
  }
};
