export type IntelClassification = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET";
export type SentimentLevel =
  | "STRONG_SUPPORTER"
  | "SUPPORTER"
  | "UNDECIDED"
  | "OPPOSED"
  | "STRONG_OPPONENT";

export interface Anecdote {
  id: string;
  title: string;
  content: string;
  classification: IntelClassification;
  author_id: string;
  author_name: string;
  campaign_id: string;
  district_id: string | null;
  district_name: string | null;
  latitude: number | null;
  longitude: number | null;
  gps_accuracy: number | null;
  media_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface CanvassEntry {
  id: string;
  voter_id: string;
  voter_name: string;
  sentiment: SentimentLevel;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  gps_accuracy: number | null;
  media_urls: string[];
  campaign_id: string;
  created_at: string;
}

export interface AnecdoteFilters {
  classification?: IntelClassification | IntelClassification[];
  date_from?: string;
  date_to?: string;
  author_id?: string;
  district_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface AnecdoteCreatePayload {
  title: string;
  content: string;
  classification: IntelClassification;
  campaign_id: string;
  district_id?: string;
  latitude?: number;
  longitude?: number;
  gps_accuracy?: number;
  media_urls?: string[];
}

export interface AnecdoteUpdatePayload {
  title?: string;
  content?: string;
  classification?: IntelClassification;
  district_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  gps_accuracy?: number | null;
  media_urls?: string[];
}

export interface CanvassSubmitPayload {
  voter_id: string;
  voter_name: string;
  sentiment: SentimentLevel;
  notes: string;
  latitude?: number;
  longitude?: number;
  gps_accuracy?: number;
  media_urls?: string[];
  campaign_id: string;
}

export interface OfflineQueueItem {
  id: string;
  data: CanvassSubmitPayload | AnecdoteCreatePayload;
  timestamp: number;
  type: "canvass" | "anecdote";
  synced: boolean;
}

export interface PaginatedAnecdotes {
  items: Anecdote[];
  total: number;
  page: number;
  page_size: number;
}

export const CLASSIFICATION_OPTIONS: { value: IntelClassification; label: string }[] = [
  { value: "PUBLIC", label: "Public" },
  { value: "INTERNAL", label: "Internal" },
  { value: "CONFIDENTIAL", label: "Confidential" },
  { value: "SECRET", label: "Secret" },
];

export const SENTIMENT_OPTIONS: { value: SentimentLevel; label: string }[] = [
  { value: "STRONG_SUPPORTER", label: "Strong Supporter" },
  { value: "SUPPORTER", label: "Supporter" },
  { value: "UNDECIDED", label: "Undecided" },
  { value: "OPPOSED", label: "Opposed" },
  { value: "STRONG_OPPONENT", label: "Strong Opponent" },
];

export const CLASSIFICATION_LABEL: Record<IntelClassification, string> = {
  PUBLIC: "Public",
  INTERNAL: "Internal",
  CONFIDENTIAL: "Confidential",
  SECRET: "Secret",
};

export const SENTIMENT_LABEL: Record<SentimentLevel, string> = {
  STRONG_SUPPORTER: "Strong Supporter",
  SUPPORTER: "Supporter",
  UNDECIDED: "Undecided",
  OPPOSED: "Opposed",
  STRONG_OPPONENT: "Strong Opponent",
};
