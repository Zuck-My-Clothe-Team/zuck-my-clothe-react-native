import { axiosInstance } from "@/hooks/axiosInstance";

export async function getEmployeeContractByUserId(userId: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/employee-contract/user/${userId}`);
    return result;
  } catch (error) {
    console.error("Error during fetch contracts by user id:", error);
    throw error;
  }
}
