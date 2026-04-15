import { useState, useEffect, useRef } from "react";
import { listTickets } from "../api/ticketApi";
import type { PaginatedTickets, TicketsQueryParams } from "../types";

// Fields that, when changed, should reset pagination to page 1.
const LOCATION_FILTER_KEYS: ReadonlyArray<keyof TicketsQueryParams> = [
  "has_location",
  "city_municipality",
  "barangay_or_district",
  "geo_precision",
  "center_lat",
  "center_lng",
  "radius_km",
];

export function useTickets(params: TicketsQueryParams) {
  const [data, setData] = useState<PaginatedTickets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);
  const paramsKeyRef = useRef(paramsKey);

  useEffect(() => {
    paramsKeyRef.current = paramsKey;
    setLoading(true);
    setError(null);
    listTickets(params)
      .then((result) => {
        if (paramsKeyRef.current === paramsKey) setData(result);
      })
      .catch((e: unknown) => {
        if (paramsKeyRef.current === paramsKey) {
          setError(e instanceof Error ? e.message : "Failed to load tickets.");
        }
      })
      .finally(() => {
        if (paramsKeyRef.current === paramsKey) setLoading(false);
      });
  }, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

// ---------------------------------------------------------------------------
// Helper: derive effective page when location filters change.
// ---------------------------------------------------------------------------

export function derivePageForFilters(
  prevParams: TicketsQueryParams,
  nextParams: TicketsQueryParams,
  currentPage: number,
): number {
  const locationFilterChanged = LOCATION_FILTER_KEYS.some(
    (k) => prevParams[k] !== nextParams[k],
  );
  return locationFilterChanged ? 1 : currentPage;
}
