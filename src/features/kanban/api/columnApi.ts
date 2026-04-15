import { apiFetch } from "./client";

export function createColumn(
  boardId: number,
  data: { title: string }
): Promise<{ message: string; data: { id: number } }> {
  return apiFetch(`/boards/${boardId}/columns`, { method: "POST", body: JSON.stringify(data) });
}

export function updateColumn(
  columnId: number,
  data: { title: string }
): Promise<{ message: string }> {
  return apiFetch(`/columns/${columnId}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteColumn(columnId: number): Promise<{ message: string }> {
  return apiFetch(`/columns/${columnId}`, { method: "DELETE" });
}

export function reorderColumns(
  boardId: number,
  items: { id: number; order_index: number }[]
): Promise<{ message: string }> {
  return apiFetch(`/boards/${boardId}/columns/reorder`, {
    method: "PUT",
    body: JSON.stringify({ items }),
  });
}
