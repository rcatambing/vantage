import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  Checkbox,
  Callout,
  Spinner,
  Tag,
} from "@blueprintjs/core";
import {
  useRecomputeCompositesJob,
  useSnapshotStagesJob,
  useRefreshSemanticLayerJob,
} from "../hooks";

export interface ComputationRunDialogProps {
  jobKind: "recompute" | "snapshot" | "refresh";
  campaignId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const JOB_TITLES: Record<"recompute" | "snapshot" | "refresh", string> = {
  recompute: "Recompute Composites",
  snapshot: "Snapshot Stages",
  refresh: "Refresh Semantic Layer",
};

const JOB_INTENTS: Record<"recompute" | "snapshot" | "refresh", Intent> = {
  recompute: Intent.PRIMARY,
  snapshot: Intent.WARNING,
  refresh: Intent.SUCCESS,
};

export default function ComputationRunDialog({
  jobKind,
  campaignId,
  isOpen,
  onClose,
}: ComputationRunDialogProps) {
  const [allCampaigns, setAllCampaigns] = useState(false);

  const recompute = useRecomputeCompositesJob();
  const snapshot = useSnapshotStagesJob();
  const refresh = useRefreshSemanticLayerJob();

  const active =
    jobKind === "recompute"
      ? recompute
      : jobKind === "snapshot"
      ? snapshot
      : refresh;

  const title = JOB_TITLES[jobKind];
  const intent = JOB_INTENTS[jobKind];

  function handleRun() {
    const payload = {
      campaign_id: allCampaigns ? null : (campaignId ?? null),
    };
    if (jobKind === "recompute") {
      recompute.run({ ...payload, dry_run: false });
    } else if (jobKind === "snapshot") {
      snapshot.run({ ...payload, snapshot_date: new Date().toISOString().split("T")[0] });
    } else {
      refresh.run(payload);
    }
  }

  function handleClose() {
    active.clear();
    setAllCampaigns(false);
    onClose();
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title={title} icon="build">
      <DialogBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Callout intent={Intent.NONE} icon="info-sign">
            This will trigger the <strong>{title}</strong> job.
            {jobKind === "snapshot" && (
              <> The snapshot date will be set to today.</>
            )}
          </Callout>

          <Checkbox
            label="Run for all campaigns"
            checked={allCampaigns}
            onChange={(e) => setAllCampaigns(e.currentTarget.checked)}
          />

          {active.submitting && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={16} />
              <span style={{ fontSize: 12 }}>Running job…</span>
            </div>
          )}

          {active.error && (
            <Callout intent={Intent.DANGER} icon="error" title="Job failed">
              {active.error}
            </Callout>
          )}

          {active.result && (
            <Callout intent={Intent.SUCCESS} icon="tick" title="Job completed">
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span>{active.result.message}</span>
                {"rows_written" in active.result && (
                  <Tag minimal intent={Intent.PRIMARY}>
                    Rows written: {active.result.rows_written}
                  </Tag>
                )}
                {"algorithm_version" in active.result && (
                  <Tag minimal intent={Intent.NONE}>
                    Algorithm: {active.result.algorithm_version}
                  </Tag>
                )}
                {"snapshot_date" in active.result && (
                  <Tag minimal intent={Intent.NONE}>
                    Snapshot: {active.result.snapshot_date}
                  </Tag>
                )}
              </div>
            </Callout>
          )}
        </div>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button
              intent={intent}
              text="Run Job"
              onClick={handleRun}
              disabled={active.submitting || !!active.result}
            />
          </>
        }
      />
    </Dialog>
  );
}
