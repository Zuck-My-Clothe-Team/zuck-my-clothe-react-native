import { axiosInstance } from "@/hooks/axiosInstance";
import {
  IAvailableMachine,
  IMachineInBranch,
  IMachineUpdateStatus,
} from "./../interface/machinebranch.interface";

export async function getMachineByBranchID(branch_id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/machine/branch/${branch_id}`);
    const data: IMachineInBranch[] = result.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error during fetch machine by branch id:", error);
    throw error;
  }
}

export async function getMachineDetailBySerial(serial_id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/machine/detail/${serial_id}`);
    const data: IMachineInBranch = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch machine by serial id:", error);
    throw error;
  }
}

export async function getAvailableMachineByBranchID(branch_id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/machine/available/branch/${branch_id}`);
    const data: IAvailableMachine[] = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch available machine by branch id:", error);
    throw error;
  }
}

export async function updateMachineActiveStatus(
  serial_id: string,
  active_status: boolean
) {
  try {
    const axios = await axiosInstance();
    const result = await axios.put(
      `/machine/update/${serial_id}/set_active/${active_status}`
    );
    const data: IMachineUpdateStatus = result.data;
    return data;
  } catch (error) {
    const err = error as any;
    console.error(
      "Error during updateMachineActiveStatus:",
      err.response?.data || err.message
    );
    throw error;
  }
}
