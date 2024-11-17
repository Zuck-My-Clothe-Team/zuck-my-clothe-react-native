import { axiosInstance } from "@/hooks/axiosInstance";
import { IUserAddress } from "@/interface/userdetail.interface";

export async function getUserAddress() {
  try {
    const axios = await axiosInstance();
    const result = await axios.get("/address/detail/owner");
    const data: IUserAddress[] = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch user address data:", error);
    throw error;
  }
}
