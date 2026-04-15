import { useState, useEffect, useRef } from "react";
import { getTicket } from "../api/ticketApi";
import type { Ticket, TicketLocationHistoryEntry } from "../types";

export interface UseTicketResult {
  ticket: Ticket | null;
  locationHistory: TicketLocationHistoryEntry[];
  loading: boolean;
  error: string | null;
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  refetch: () => void;
}

export function useTicket(id: string | undefined): UseTicketResult {
  const [ticket, setTicket] = useState<Ticket | null>(null);
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
    getTicket(id)
      .then((value) => {
        if (requestIdRef.current === requestId) setTicket(value);
      })
      .catch((e: unknown) => {
        if (requestIdRef.current === requestId) {
          setError(e instanceof Error ? e.message : "Failed to load ticket.");
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });
  }, [id, fetchCount]);

  const locationHistory: TicketLocationHistoryEntry[] =
    ticket?.location_history ?? [];

  function refetch() {
    setFetchCount((n) => n + 1);
  }

  return { ticket, locationHistory, loading, error, setTicket, refetch };
}
