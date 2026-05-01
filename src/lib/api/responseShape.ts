export type ListResponseWire<T> =
  | T[]
  | {
      items?: T[];
      data?: T[];
    }
  | null
  | undefined;

export function normalizeListResponse<T>(res: ListResponseWire<T>): T[] {
  if (Array.isArray(res)) {
    return res;
  }
  if (!res || typeof res !== "object") {
    return [];
  }

  if (Array.isArray(res.items)) {
    return res.items;
  }
  if (Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}
