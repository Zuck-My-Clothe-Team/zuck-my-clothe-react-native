import { axiosInstance } from "@/hooks/axiosInstance";

export async function getUserDetailByUserId(userId: string) {
  const axios = await axiosInstance();
  try {
    const result = await axios.get(`/users/${userId}`);
    return result;
  } catch {
    return null;
  }
}
