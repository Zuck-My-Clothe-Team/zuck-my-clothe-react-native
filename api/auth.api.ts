import { axiosInstance } from "@/hooks/axiosInstance";
import { IAuth } from "@/interface/auth.interface";
import { IUserDetail } from "@/interface/userdetail.interface";

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

export async function CheckToken(accessToken: string) {
  const axios = await axiosInstance();
  try {
    const result = await axios.get(`/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data: IUserDetail = result.data.data;
    return data;
  } catch {
    return null;
  }
}

export async function SignIn(data: IAuth) {
  try {
    const axios = await axiosInstance();
    const result = await axios.post(`/auth/signin`, data);
    return result;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
