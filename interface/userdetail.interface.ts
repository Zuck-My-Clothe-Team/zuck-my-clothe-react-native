export interface IUsers
  {
    created_at: string;
    deleteAt: null;
    email: string;
    firstname: string;
    google_id: string;
    lastname: string;
    password: string;
    phone: string;
    profile_image_url: string;
    role: IRoles;
    updated_at: string;
    user_id: string
  }


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

export enum IRoles {
  SuperAdmin = "SuperAdmin",
  BranchManager = "BranchManager",
  Employee = "Employee",
  Client = "Client"
}

export interface IUserUpdate{
    firstname: string;
    lastname: string;
    phone: string;
    role: IRoles;
  }

