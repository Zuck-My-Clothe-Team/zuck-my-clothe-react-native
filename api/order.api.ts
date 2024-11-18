import { axiosInstance } from "@/hooks/axiosInstance";
import { IOrder, IOrderReview, ICreatedOrder, INewOrder, IOrderUpdateDTO } from "@/interface/order.interface";

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

export async function updateOrderReview(orderreview : IOrderReview) {
    try {
      const axios = await axiosInstance();
      const result = await axios.put(`/order/review`,orderreview);
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
    const data: ICreatedOrder = result.data;
    return data;
  } catch (error) {
    console.error("Error during create new order:", error);
    throw error;
  }
}

export async function getOrderByOrderHeaderId(orderHeaderId: string) {
  try {
    const axios = await axiosInstance();
    const result = await axios.get(`/order/${orderHeaderId}/full`);
    return result;
  } catch (error) {
    console.error("Error during fetch order by order header id:", error);
    throw error;
  }
}

export async function updateStatusOrder(updateDTO: IOrderUpdateDTO) {
  try {
    const axios = await axiosInstance();
    const result = await axios.put(`/order/update`, updateDTO);
    return result;
  } catch (error) {
    console.error("Error during update status order:", error);
    throw error;
  }
}
