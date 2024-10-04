export interface IUserDetail {
  data: UserDetail;
  token: string;
}

export interface UserDetail {
  user_id: string;
  email: string;
  name: string;
  role: string;
  surname: string;
}
