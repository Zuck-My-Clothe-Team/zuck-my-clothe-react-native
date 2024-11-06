import { axiosInstance } from "@/hooks/axiosInstance";
import { IBranch } from "@/interface/branch.interface";

interface IUserPosition {
  user_lat: number;
  user_lon: number;
}

export async function getClosestBranch(userPosition: IUserPosition) {
  try {
    const axios = await axiosInstance();
    const result = await axios.post("/branch/closest-to-me", userPosition);
    const data: IBranch[] = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch data (All Branch):", error);
    throw error;
  }
}

export async function GetAllBranch() {
  try {
    const axios = await axiosInstance();
    const result = await axios.get("/branch/all");
    const data: IBranch[] = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch data (All Branch):", error);
    throw error;
  }
}

// export async function GetOwnBranch() {
//   const result = await axiosInstance.get("/branch/owns");
//   return result;
// }

// export async function CreateBranch(data: IBranch) {
//   const result = await axiosInstance.post("/branch/create", data);
//   return result;
// }

// export async function DeleteBranch(branchID: string) {
//   const result = await axiosInstance.delete(`/branch/${branchID}`);
//   return result;
// }
