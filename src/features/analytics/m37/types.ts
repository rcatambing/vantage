export interface M37BattlegroundEntry {
  district_id: number;
  district_name: string;
  our_support: number;
  opponent_support: number;
  margin: number;
}

export interface M37Data {
  metric: string;
  campaign_id: number;
  margin_threshold: number;
  our_candidate: string;
  battlegrounds: M37BattlegroundEntry[];
  computed_at: string;
}

export interface M37Params {
  campaign_id: string;
}
