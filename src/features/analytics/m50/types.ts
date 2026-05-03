export interface M50ChannelBreakdown {
  contact_type: string;
  contacts_made: number;
  unique_voters_reached: number;
  outreach_spend: number;
  cost_per_contact: number | null;
  cost_per_voter: number | null;
  cost_display: string;
}

export interface M50Data {
  metric: string;
  campaign_id: number;
  overall_cost_per_contact: number | null;
  overall_cost_per_voter: number | null;
  overall_contact_display: string;
  overall_voter_display: string;
  total_outreach_spend: number;
  total_contacts: number;
  total_unique_voters: number;
  channel_count: number;
  channel_breakdown: M50ChannelBreakdown[];
  computed_at: string;
}

export interface M50Params {
  campaign_id: string;
  contact_type?: string;
}
