export enum MachineType {
  Washer = "Washer",
  Dryer = "Dryer",
}

export interface IUserReviews {
  firstname: string;
  lastname: string;
  profile_image_url: string;
  review_comment: string;
  star_rating: number;
}

export interface IBranch {
  average_star: number;
  branch_detail: string;
  branch_id: string;
  branch_lat: number;
  branch_long: number;
  branch_name: string;
  created_at: string;
  created_by: string;
  deleted_at: string;
  deleted_by: string;
  distance: number;
  machines: IMachine[];
  owner_user_id: string;
  updated_at: string;
  updated_by: string;
  user_reviews: IUserReviews[];
}

export interface IBranchDetail {
  average_star: 0;
  branch_detail: string;
  branch_id: string;
  branch_lat: 0;
  branch_long: 0;
  branch_name: string;
  created_at: string;
  created_by: string;
  deleted_at: null;
  deleted_by: string;
  distance: 0;
  machines: [
    {
      finished_at: string;
      is_available: true;
      machine_label: string;
      machine_serial: string;
      machine_type: MachineType;
      weight: 0;
    }
  ];
  owner_user_id: string;
  updated_at: string;
  updated_by: string;
  user_reviews: [
    {
      firstname: string;
      lastname: string;
      profile_image_url: string;
      review_comment: string;
      star_rating: 0;
    }
  ];
}

interface IMachine {
  finished_at: string;
  is_available: true;
  machine_label: string;
  machine_serial: string;
  machine_type: string;
  weight: 0 | 7 | 14 | 21;
}
