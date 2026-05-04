import { useState, useEffect, useCallback } from "react";
import {
  getDistricts,
  getDistrict,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  searchDistricts,
  getDistrictAncestors,
} from "../api/districtApi";
import type {
  District,
  DistrictListResponse,
  DistrictParams,
  DistrictCreatePayload,
  DistrictUpdatePayload,
} from "../types";

/* ── useDistrictList ───────────────────────────────────────────────────── */

export function useDistrictList(filters: DistrictParams = {}) {
  const [data, setData] = useState<DistrictListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDistricts(filters);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load districts");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

/* ── useDistrict ──────────────────────────────────────────────────────── */

export function useDistrict(districtId: string | undefined) {
  const [data, setData] = useState<District | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!districtId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getDistrict(districtId);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load district");
    } finally {
      setLoading(false);
    }
  }, [districtId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

/* ── useDistrictMutations ─────────────────────────────────────────────── */

export function useDistrictMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: DistrictCreatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createDistrict(payload);
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create district");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: DistrictUpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateDistrict(id, payload);
      return res;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update district");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDistrict(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete district");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, update, remove, loading, error };
}

/* ── useDistrictSearch ────────────────────────────────────────────────── */

export function useDistrictSearch() {
  const [results, setResults] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await searchDistricts(q);
      setResults(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}

/* ── useDistrictAncestors ─────────────────────────────────────────────── */

export function useDistrictAncestors(districtId: string | undefined) {
  const [data, setData] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!districtId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getDistrictAncestors(districtId);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ancestors");
    } finally {
      setLoading(false);
    }
  }, [districtId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

/* Legacy export for backward compatibility */
export const useDistricts = useDistrictList;
