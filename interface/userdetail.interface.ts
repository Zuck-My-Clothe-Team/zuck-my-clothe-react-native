export interface IUserAuthContext extends IUserDetail {
  isAuth: boolean;
}

export interface IUserTokenDetail {
  data: IUserDetail;
  token: string;
}

export interface IUserDetail {
  user_id: string;
  email: string;
  firstname: string;
  role: string;
  lastname: string;
  phone: string;
  profile_image_url: string;
}

export interface IUserAddress {
  address: string;
  address_id: string;
  district: string;
  lat: number;
  long: number;
  province: string;
  subdistrict: string;
  user_id: string;
  zipcode: string;
}
