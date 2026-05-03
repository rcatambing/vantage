import { apiFetch } from "../../../lib/api/client";

export function recomputeCompositesJob(payload: {
  campaign_id?: string | null;
  dry_run?: boolean;
}) {
  return apiFetch<{
    message: string;
    rows_written: number;
    algorithm_version: string;
  }>("/intelligence/jobs/recompute-composites", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function snapshotStagesJob(payload: {
  campaign_id?: string | null;
  snapshot_date?: string;
}) {
  return apiFetch<{
    message: string;
    rows_written: number;
    snapshot_date: string;
  }>("/intelligence/jobs/snapshot-stages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refreshSemanticLayerJob(payload: {
  campaign_id?: string | null;
}) {
  return apiFetch<{ message: string }>(
    "/intelligence/jobs/refresh-semantic-layer",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
