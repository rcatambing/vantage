import { useState } from "react";
import {
  Card,
  Button,
  Intent,
  Tag,
  Callout,
  Spinner,
  Checkbox,
} from "@blueprintjs/core";
import ComputationRunDialog from "./ComputationRunDialog";

export interface ComputationJobPanelProps {
  campaignId: string | undefined;
  canRunJobs: boolean;
}

type JobKind = "recompute" | "snapshot" | "refresh";

export default function ComputationJobPanel({
  campaignId,
  canRunJobs,
}: ComputationJobPanelProps) {
  const [activeJob, setActiveJob] = useState<JobKind | null>(null);

  if (!canRunJobs) {
    return (
      <Card style={{ marginTop: 16 }}>
        <Callout intent={Intent.NONE} icon="info-sign" title="Job Controls">
          Computation job controls are available to admin and manager roles only.
        </Callout>
      </Card>
    );
  }

  return (
    <>
      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Tag minimal intent={Intent.PRIMARY} style={{ fontSize: 12 }}>
            Computation Jobs
          </Tag>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Button
              small
              intent={Intent.PRIMARY}
              text="Recompute Composites"
              onClick={() => setActiveJob("recompute")}
            />
            <Button
              small
              intent={Intent.WARNING}
              text="Snapshot Stages"
              onClick={() => setActiveJob("snapshot")}
            />
            <Button
              small
              intent={Intent.SUCCESS}
              text="Refresh Semantic Layer"
              onClick={() => setActiveJob("refresh")}
            />
          </div>
        </div>
      </Card>

      {activeJob && (
        <ComputationRunDialog
          jobKind={activeJob}
          campaignId={campaignId}
          isOpen={true}
          onClose={() => setActiveJob(null)}
        />
      )}
    </>
  );
}
