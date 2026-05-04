import { useState, useEffect, useCallback } from "react";
import { fetchDistricts } from "../api/districtApi";
import type { DistrictListResponse, DistrictParams } from "../types";

export function useDistricts(params: DistrictParams = {}) {
  const [data, setData] = useState<DistrictListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDistricts(params);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load districts");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
