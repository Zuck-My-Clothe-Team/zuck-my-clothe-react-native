import { axiosInstance } from "@/hooks/axiosInstance";
import { IMachineInBranch } from './../interface/machinebranch.interface';

export async function getMachineByBranchID(branch_id: string) {
    try {
      const axios = await axiosInstance();
      const result = await axios.get(`/machine/branch/${branch_id}`);
      const data: IMachineInBranch[] = result.data;
      return data;
    } catch (error) {
      console.error("Error during fetch machine by branch id:", error);
      throw error;
    }
  }