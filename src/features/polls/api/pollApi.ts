import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";
import type {
  Poll,
  PollQuestion,
  Participant,
  PollCreatePayload,
  PollUpdatePayload,
  QuestionCreatePayload,
  QuestionUpdatePayload,
  ParticipantImportResult,
  PollResponseAggregate,
} from "../types";

// ---------------------------------------------------------------------------
// Poll CRUD
// ---------------------------------------------------------------------------

export function getPolls(campaignId: string): Promise<Poll[]> {
  return apiFetch<ListResponseWire<Poll>>(`/polls?campaign_id=${encodeURIComponent(campaignId)}`).then(
    normalizeListResponse,
  );
}

export function getPoll(id: string): Promise<Poll> {
  return apiFetch<Poll>(`/polls/${id}`);
}

export function createPoll(
  payload: PollCreatePayload,
): Promise<{ message: string; data: Poll }> {
  return apiFetch<{ message: string; data: Poll }>("/polls", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePoll(
  id: string,
  payload: PollUpdatePayload,
): Promise<{ message: string; data: Poll }> {
  return apiFetch<{ message: string; data: Poll }>(`/polls/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePoll(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/polls/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Poll lifecycle
// ---------------------------------------------------------------------------

export function startPoll(id: string): Promise<{ message: string; id: string }> {
  return apiFetch<{ message: string; id: string }>(`/polls/${id}/start`, { method: "POST" });
}

export function holdPoll(id: string): Promise<{ message: string; id: string }> {
  return apiFetch<{ message: string; id: string }>(`/polls/${id}/hold`, { method: "POST" });
}

export function completePoll(id: string): Promise<{ message: string; id: string }> {
  return apiFetch<{ message: string; id: string }>(`/polls/${id}/complete`, { method: "POST" });
}

export function cancelPoll(id: string): Promise<{ message: string; id: string }> {
  return apiFetch<{ message: string; id: string }>(`/polls/${id}/cancel`, { method: "POST" });
}

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export function getQuestions(pollId: string): Promise<PollQuestion[]> {
  return apiFetch<ListResponseWire<PollQuestion>>(`/polls/${pollId}/questions`).then(
    normalizeListResponse,
  );
}

export function addQuestion(
  pollId: string,
  payload: QuestionCreatePayload,
): Promise<{ message: string; data: PollQuestion }> {
  return apiFetch<{ message: string; data: PollQuestion }>(`/polls/${pollId}/questions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateQuestion(
  pollId: string,
  questionId: string,
  payload: QuestionUpdatePayload,
): Promise<{ message: string; data: PollQuestion }> {
  return apiFetch<{ message: string; data: PollQuestion }>(`/polls/${pollId}/questions/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteQuestion(pollId: string, questionId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/polls/${pollId}/questions/${questionId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Participants
// ---------------------------------------------------------------------------

export function getParticipants(pollId: string): Promise<Participant[]> {
  return apiFetch<ListResponseWire<Participant>>(`/polls/${pollId}/participants`).then(
    normalizeListResponse,
  );
}

export function importParticipants(pollId: string, file: File): Promise<ParticipantImportResult> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<ParticipantImportResult>(`/polls/${pollId}/participants/import`, {
    method: "POST",
    body: formData,
    headers: {},
  });
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

export function getResponseAggregates(pollId: string): Promise<PollResponseAggregate[]> {
  return apiFetch<ListResponseWire<PollResponseAggregate>>(`/polls/${pollId}/responses/aggregate`).then(
    normalizeListResponse,
  );
}
