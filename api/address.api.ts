import { axiosInstance } from "@/hooks/axiosInstance";
import { IAddress } from "@/interface/address.interface";

export async function getOwnAddress() {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/address/detail/owner`);
    return result;
  } catch (error) {
    console.error("Error during fetch address :", error);
    throw error;
  }
}

export async function getAddressById(id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/address/detail/aid/${id}`);
    return result;
  } catch (error) {
    console.error("Error during fetch address :", error);
    throw error;
  }
}

export async function createAddress(data: IAddress) {
  try {
    const axios = await axiosInstance();
    const result = await axios.post(`/address/add`, data);
    return result;
  } catch (error) {
    console.error("Error during create address :", error);
    throw error;
  }
}

export async function updateAddress(data: IAddress) {
  try {
    const axios = await axiosInstance();
    const result = await axios.put(`/address/update`, data);
    return result;
  } catch (error) {
    console.error("Error during update address :", error);
    throw error;
  }
}

export async function deleteAddress(id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.delete(`/address/delete/${id}`);
    return result;
  } catch (error) {
    console.error("Error during delete address :", error);
    throw error;
  }
}
