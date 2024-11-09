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

export async function getBranchByID(branch_id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/branch/${branch_id}`);
    const data: IBranch = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch branch by id:", error);
    throw error;
  }
}