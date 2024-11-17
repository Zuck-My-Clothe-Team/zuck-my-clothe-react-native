export interface INewOrder {
  branch_id: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_long: number;
  order_detail: IOrderDetail[];
  order_note: string;
  userID: string;
  zuck_onsite: boolean;
}

export interface ICreatedOrder {
  data: any;
  branch_id: string;
  created_at: string;
  created_by: string;
  deleted_at: null;
  deleted_by: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_long: number;
  order_details: ICreatedOrderDetail[];
  order_header_id: string;
  order_note: string;
  payment_id: string;
  review_comment: string;
  star_rating: number;
  updated_at: string;
  updated_by: string;
  user_detail: {
    email: string;
    firstname: string;
    google_id: string;
    lastname: string;
    phone: string;
    profile_image_url: string;
    role: string;
    user_id: string;
  };
  user_id: string;
  zuck_onsite: true;
}

interface IOrderDetail {
  service_type: string;
  weight: 0 | 7 | 14 | 21;
}

interface ICreatedOrderDetail {
  created_at: string;
  created_by: string;
  deleted_at: null;
  deleted_by: string;
  finished_at: string;
  machine_serial: string;
  order_basket_id: string;
  order_header_id: string;
  order_status: string;
  service_type: string;
  updated_at: string;
  updated_by: string;
  weight: number;
}
