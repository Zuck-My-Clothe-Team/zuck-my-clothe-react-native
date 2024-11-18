import { axiosInstance } from "@/hooks/axiosInstance";
import { IOrder, IOrderReview, ICreatedOrder, INewOrder } from "@/interface/order.interface";

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

