import { useState, useEffect, useRef } from "react";
import { listTasks } from "../api/taskApi";
import type { PaginatedTasks, TasksQueryParams } from "../types";

export function useTasks(params: TasksQueryParams) {
  const [data, setData] = useState<PaginatedTasks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);
  const paramsKeyRef = useRef(paramsKey);

  useEffect(() => {
    paramsKeyRef.current = paramsKey;
    setLoading(true);
    setError(null);
    listTasks(params)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(e instanceof Error ? e.message : "Failed to load tasks.");
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
