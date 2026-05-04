import { Intent } from "@blueprintjs/core";

export type PollStatus = "NOT_STARTED" | "ONGOING" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
export type QuestionType = "LIKERT" | "BOOLEAN" | "MULTIPLE_CHOICE" | "TEXT" | "RATING";

export interface Poll {
  id: string;
  name: string;
  description: string;
  campaign_id: string;
  status: PollStatus;
  target_response_count: number;
  actual_response_count: number;
  created_at: string;
}

export interface PollQuestion {
  id: string;
  poll_id: string;
  question_type: QuestionType;
  text: string;
  options: string[] | null;
  order_index: number;
}

export interface Participant {
  id: string;
  poll_id: string;
  voter_id: string;
  voter_name: string;
  status: "PENDING" | "RESPONDED" | "DECLINED";
}

export interface PollCreatePayload {
  name: string;
  description: string;
  campaign_id: string;
  target_response_count: number;
}

export interface PollUpdatePayload {
  name?: string;
  description?: string;
  target_response_count?: number;
}

export interface QuestionCreatePayload {
  question_type: QuestionType;
  text: string;
  options?: string[];
  order_index: number;
}

export interface QuestionUpdatePayload {
  question_type?: QuestionType;
  text?: string;
  options?: string[] | null;
  order_index?: number;
}

export interface ParticipantImportResult {
  success_count: number;
  error_count: number;
  error_rows: { row: number; reason: string }[];
}

export interface PollResponseAggregate {
  question_id: string;
  question_text: string;
  question_type: QuestionType;
  total_responses: number;
  breakdown: Record<string, number>;
}

export const POLL_STATUS_INTENT: Record<PollStatus, Intent> = {
  NOT_STARTED: Intent.NONE,
  ONGOING: Intent.PRIMARY,
  ON_HOLD: Intent.WARNING,
  COMPLETED: Intent.SUCCESS,
  CANCELLED: Intent.DANGER,
};

export const POLL_STATUS_LABEL: Record<PollStatus, string> = {
  NOT_STARTED: "Not Started",
  ONGOING: "Ongoing",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "LIKERT", label: "Likert Scale" },
  { value: "BOOLEAN", label: "Yes / No" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "TEXT", label: "Free Text" },
  { value: "RATING", label: "Rating" },
];

export const PARTICIPANT_STATUS_INTENT: Record<Participant["status"], Intent> = {
  PENDING: Intent.NONE,
  RESPONDED: Intent.SUCCESS,
  DECLINED: Intent.DANGER,
};

export const PARTICIPANT_STATUS_LABEL: Record<Participant["status"], string> = {
  PENDING: "Pending",
  RESPONDED: "Responded",
  DECLINED: "Declined",
};
