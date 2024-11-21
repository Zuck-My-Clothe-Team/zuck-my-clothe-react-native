import { axiosInstance } from "@/hooks/axiosInstance";
import { IMachineReport } from "@/interface/report.interface";

export async function reportMachine(machineReport: IMachineReport) {
  try {
    const axios = await axiosInstance();
    const result = await axios.post("/report/add", machineReport);
    return result;
  } catch (error) {
    console.error("Error during report machine:", error);
    throw error;
  }
}
