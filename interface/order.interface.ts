import { TWeight } from "./machinebranch.interface";
import { IUserDetail } from "./userdetail.interface";

export enum WorkingStatus {
  Waiting = "Waiting",
  Pickup = "Pickup",
  BackToStore = "BackToStore",
  Processing = "Processing",
  OutOfDelivery = "OutOfDelivery",
  Completed = "Completed",
  Canceled = "Canceled",
  Expired = "Expired",
}

export enum WorkingStatusTH {
  Waiting = "มาใหม่",
  Pickup = "กำลังรับผ้า",
  BackToStore = "ผ้าถึงร้าน",
  Processing = "กำลังทำงาน",
  OutOfDelivery = "กำลังส่งผ้า",
  Completed = "เสร็จสิ้น",
  Canceled = "ยกเลิก",
}

export enum OrderStatus {
  Waiting = "Waiting",
  Processing = "Processing",
  Completed = "Completed",
  Canceled = "Canceled",
  Expired = "Expired",
}

export enum ServiceType {
  Washing = "Washing",
  Drying = "Drying",
  Pickup = "Pickup",
  Delivery = "Delivery",
  Agents = "Agents",
}

export enum ServiceTypeTH {
  Washing = "เครื่องซัก",
  Drying = "เครื่องอบ",
  Pickup = "รับผ้า",
  Delivery = "ส่งผ้า",
  Agents = "ค่าน้ำยาซัก-ปรับผ้านุ่ม",
  DeliveryOrPickup = "รับ-ส่งผ้า",
}

export interface IOrderUpdateDTO {
  finished_at: string;
  machine_serial: string | null;
  order_basket_id: string;
  order_status: OrderStatus;
}

export interface IOrderDetail {
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  finished_at: string;
  machine_serial: string;
  order_basket_id: string;
  order_header_id: string;
  order_status: OrderStatus;
  service_type: ServiceType;
  updated_at: string;
  updated_by: string;
  weight: TWeight;
}

export interface IOrder {
  branch_id: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_long: number;
  order_details: IOrderDetail[];
  order_header_id: string;
  order_note: string;
  payment_id: string;
  review_comment: string;
  star_rating: number;
  updated_at: string;
  updated_by: string;
  user_id: string;
  user_detail: IUserDetail;
  zuck_onsite: boolean;
}

export interface IOrderReview {
  order_header_id: string;
  review_comment: string;
  star_rating: number;
  userID: string;
}

export interface INewOrder {
  branch_id: string | null;
  delivery_address: string | null;
  delivery_lat: number | null;
  delivery_long: number | null;
  order_details: INewOrderDetail[];
  order_note: string | null;
  user_id: string | null;
  zuck_onsite: boolean;
}

export interface INewOrderDetail {
  service_type?: ServiceType;
  weight?: TWeight;
  machine_serial: string | null;
}
