import { axiosInstance } from "@/hooks/axiosInstance";

export async function GoogleLogin(accessToken: string) {
  const result = await axiosInstance.post(`/auth/google/callback`, {
    accessToken: accessToken,
  });
  return result.data;
}
