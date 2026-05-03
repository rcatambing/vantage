export interface N37Data {
  metric: string;
  campaign_id: number;
  province: string | null;
  urban_classes: string[];
  rural_classes: string[];
  disparity: number;
  urban_avg: number;
  rural_avg: number;
  urban_count: number;
  rural_count: number;
  computed_at: string;
}

export interface N37Params {
  campaign_id: string;
  province?: string;
  urban_classes?: string;
  rural_classes?: string;
}
