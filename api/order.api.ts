import { axiosInstance } from "@/hooks/axiosInstance";
import { IOrder, IOrderReview, INewOrder } from "@/interface/order.interface";
import axios from "axios";

export async function getAllOrderInBranch(branch_id: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/order/branch/${branch_id}`);
    return result;
  } catch (error) {
    console.error("Error during fetch order by branch id:", error);
  }
}

export async function getFullOrderByUserID() {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/order/me`);
    const data: IOrder[] = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch order by user id:", error);
    throw error;
  }
}

export async function updateOrderReview(orderreview: IOrderReview) {
  try {
    const axios = await axiosInstance();
    const result = await axios.put(`/order/review`, orderreview);
    const data: IOrder[] = result.data;
    return data;
  } catch (error) {
    console.error("Error during update order review:", error);
    throw error;
  }
}

export async function createNewOrder(newOrder: INewOrder) {
  try {
    const axios = await axiosInstance();
    const result = await axios.post("/order/new", newOrder);
    const data: IOrder = result.data;
    return data;
  } catch (error) {
    console.error("Error during create new order:", error);
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }
    throw error;
  }
}

export async function getOrderByOrderHeaderId(
  order_header_id: string,
  options?: string
) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/order/${order_header_id}/${options}`);
    const data: IOrder = result.data;
    return data;
  } catch (error) {
    console.error("Error during fetch order by order header id:", error);
  }
}
