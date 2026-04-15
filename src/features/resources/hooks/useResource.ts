import { useState, useEffect, useCallback } from "react";
import { getResource } from "../api/resourceApi";
import type { Resource } from "../types";

export function useResource(id: string) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResource = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getResource(id);
      setResource(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resource");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadResource();
  }, [loadResource]);

  return { resource, loading, error, refetch: loadResource };
}
