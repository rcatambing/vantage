export interface CampaignActivity {
  activity_id: number;
  campaign_id: number;
  activity_type: string;
  title: string;
  description: string | null;
  status: string;
  district_id: number | null;
  venue: string | null;
  address: string | null;
  expected_attendance: number;
  actual_attendance: number;
  voter_attendance: number;
  scheduled_at: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityListResponse {
  items: CampaignActivity[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ActivityParams {
  campaign_id?: string;
  status?: string;
  activity_type?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
}
