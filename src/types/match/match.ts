export type MatchType = {
  matchId: number;
  title: string;
  start_time: string;
  sportsType: number;
  end_time: string;
  date: string;
  createdAt: string;
  likeCount: number;
  placeAddress: string;
};

export type MatchDetailType = {
  match_id: number;
  room_id: number;
  user_id: number;
  title: string;
  content: string;
  sports_type: number;
  date: string;
  start_time: string;
  end_time: string;
  least_size: number;
  max_size: number;
  member_count: number;
  placeAddress: string;
  placeLocation: string;
  image_url: string;
  user_nickname: string;
  likeCount: number;
  created_at: string;
  updated_at: string;
};
