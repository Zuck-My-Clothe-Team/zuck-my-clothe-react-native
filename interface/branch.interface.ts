export interface IUserReviews {
  firstname: string;
  lastname: string;
  profile_image_url: string;
  review_comment: string;
  star_rating: number;
}

export interface IBranch {
    branch_detail: string;
    branch_id: string;
    branch_lat: number;
    branch_long: number;
    branch_name: string;
    distance: number;
    owner_user_id: string;
    user_reviews: IUserReviews[];
  }