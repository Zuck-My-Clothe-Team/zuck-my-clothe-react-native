import { axiosInstance } from "@/hooks/axiosInstance";
import { ICreatedOrder, INewOrder } from "@/interface/order.interface";

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
