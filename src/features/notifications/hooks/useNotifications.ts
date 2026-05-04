import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notificationApi";
import type { NotificationListResponse, NotificationParams } from "../types";

export function useNotifications(params: NotificationParams = {}) {
  const [data, setData] = useState<NotificationListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNotifications(params);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
