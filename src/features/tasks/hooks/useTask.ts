import { useState, useEffect, useRef } from "react";
import { getTask } from "../api/taskApi";
import type { CampaignTaskDetail } from "../types";

export interface UseTaskResult {
  task: CampaignTaskDetail | null;
  loading: boolean;
  error: string | null;
  setTask: React.Dispatch<React.SetStateAction<CampaignTaskDetail | null>>;
  refetch: () => void;
}

export function useTask(id: string | undefined): UseTaskResult {
  const [task, setTask] = useState<CampaignTaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchCount, setFetchCount] = useState(0);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    setLoading(true);
    setError(null);
    getTask(id)
      .then((value) => {
        if (requestIdRef.current === requestId) setTask(value);
      })
      .catch((e: unknown) => {
        if (requestIdRef.current === requestId) {
          setError(e instanceof Error ? e.message : "Failed to load task.");
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  }, [id, fetchCount]);

  function refetch() {
    setFetchCount((n) => n + 1);
  }

  return { task, loading, error, setTask, refetch };
}
