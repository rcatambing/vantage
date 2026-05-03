import { Callout, Spinner, Classes, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import SemicircularGauge from "./components/SemicircularGauge";
import MilestoneProgressBars from "./components/MilestoneProgressBars";
import { useM12MilestoneProgress } from "./hooks/useM12MilestoneProgress";

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function MilestoneProgressPanel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM12MilestoneProgress(campaignId);

  const progress = data?.overall_progress_percent ?? 0;

  return (
    <Panel
      id="m12-MLP"
      name="Milestone Progress"
      size="medium"
      onRemove={onRemove}
      actions={<Button icon="refresh" minimal small onClick={refetch} title="Refresh" />}
    >
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spinner size={24} />
        </div>
      )}
      {!loading && error && (
        <Callout intent="danger" title="Failed to load">
          {error}
        </Callout>
      )}
      {!loading && !error && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SemicircularGauge
            progress={progress}
            label={`${fmtNum.format(data.completed_milestones)} of ${fmtNum.format(data.total_milestones)} milestones`}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div
              style={{
                flex: 1,
                minWidth: 80,
                padding: "6px 12px",
                background: "var(--cds-layer-02)",
                borderRadius: 2,
                borderLeft: "3px solid var(--cds-interactive)",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.1 }}>
                {fmtNum.format(data.completed_milestones)}
              </div>
              <div
                style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3 }}
                className={Classes.TEXT_MUTED}
              >
                Completed
              </div>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 80,
                padding: "6px 12px",
                background: "var(--cds-layer-02)",
                borderRadius: 2,
                borderLeft: "3px solid #8d8d8d",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.1 }}>
                {fmtNum.format(data.total_milestones - data.completed_milestones)}
              </div>
              <div
                style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3 }}
                className={Classes.TEXT_MUTED}
              >
                Remaining
              </div>
            </div>
          </div>
          <MilestoneProgressBars tasks={data.by_task} />
        </div>
      )}
    </Panel>
  );
}
