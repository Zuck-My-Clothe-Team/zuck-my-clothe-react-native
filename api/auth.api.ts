import { axiosInstance } from "@/hooks/axiosInstance";

export async function GoogleLogin(accessToken: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.post(`/auth/google/callback`, {
      accessToken: accessToken,
    });
    return result.data;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
}
