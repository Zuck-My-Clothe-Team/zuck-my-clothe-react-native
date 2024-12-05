import { axiosInstance } from "@/hooks/axiosInstance";
import { IUserUpdate } from "@/interface/userdetail.interface";

export async function getUserDetailByUserId(userId: string) {
  const axios = await axiosInstance();
  try {
    const result = await axios.get(`/users/${userId}`);
    return result;
  } catch {
    return null;
  }
}

export async function updateUserPassword(userId: string,password:{password:string}) {
  const axios = await axiosInstance();
  try {
    const result = await axios.patch(`/users/${userId}/password`,password);
    return result;
  } catch (error){
    console.error("Error during update user password:", error);
    throw error;
  }
}

export async function updateUser(userId: string,userUpdate:IUserUpdate) {
  const axios = await axiosInstance();
  try {
    const result = await axios.patch(`/users/${userId}`,userUpdate);
    const data = result.data;
    return data;
  } catch (error){
    console.error("Error during update user password:", error);
    throw error;
  }
}