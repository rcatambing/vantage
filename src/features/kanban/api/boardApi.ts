import type { Board, BoardSummary } from "../types";
import { apiFetch } from "../../../lib/api/client";
import { normalizeListResponse, type ListResponseWire } from "../../../lib/api/responseShape";

export function fetchBoards(campaignId?: number): Promise<BoardSummary[]> {
  const params = campaignId ? `?campaign_id=${campaignId}` : "";
  return apiFetch<ListResponseWire<BoardSummary>>(`/boards${params}`).then(
    normalizeListResponse
  );
}

export function fetchBoard(boardId: number): Promise<Board> {
  return apiFetch<Board>(`/boards/${boardId}`);
}

export function createBoard(data: {
  name: string;
  key: string;
  description?: string;
  campaign_id?: number;
  owner_id: number;
}): Promise<{ message: string; data: { id: number } }> {
  return apiFetch(`/boards`, { method: "POST", body: JSON.stringify(data) });
}

export function updateBoard(
  boardId: number,
  data: { name?: string; description?: string; key?: string }
): Promise<{ message: string }> {
  return apiFetch(`/boards/${boardId}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteBoard(boardId: number): Promise<{ message: string }> {
  return apiFetch(`/boards/${boardId}`, { method: "DELETE" });
}

export function addBoardMember(
  boardId: number,
  data: { user_id: number; role?: string }
): Promise<{ message: string }> {
  return apiFetch(`/boards/${boardId}/members`, { method: "POST", body: JSON.stringify(data) });
}

export function removeBoardMember(boardId: number, userId: number): Promise<{ message: string }> {
  return apiFetch(`/boards/${boardId}/members/${userId}`, { method: "DELETE" });
}
