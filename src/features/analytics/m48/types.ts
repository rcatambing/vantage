export interface M48TopPost {
  post_id: number;
  title: string;
  author: string;
  avg_rating: number | null;
  comment_count: number;
}

export interface M48Data {
  metric: string;
  campaign_id: number;
  days_lookback: number;
  engagement_score: number | null;
  score_display: string;
  avg_post_rating: number | null;
  total_posts: number;
  total_comments: number;
  comments_per_post: number | null;
  top_posts: M48TopPost[];
  computed_at: string;
}

export interface M48Params {
  campaign_id: string;
  days?: number;
}
