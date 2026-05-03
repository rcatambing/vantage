export interface M45PlatformBreakdown {
  platform: string;
  followers: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  posts_count: number;
  engagement_rate: number | null;
  engagement_display: string;
  latest_recorded: string | null;
}

export interface M45Data {
  metric: string;
  campaign_id: number;
  overall_engagement_rate: number | null;
  overall_display: string;
  total_followers: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  total_posts: number;
  platform_count: number;
  platform_breakdown: M45PlatformBreakdown[];
  computed_at: string;
}

export interface M45Params {
  campaign_id: string;
  platform?: string;
}
