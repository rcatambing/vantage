import { Callout, Spinner, Classes, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import OverdueTaskTable from "./components/OverdueTaskTable";
import { useM11TaskOverdue } from "./hooks/useM11TaskOverdue";

const fmtPct = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const fmtNum = new Intl.NumberFormat("en-PH");

interface KpiCardProps {
  label: string;
  value: string;
  color?: string;
}

function KpiCard({ label, value, color }: KpiCardProps) {
  return (
    <div
      style={{
        minWidth: 110,
        padding: "8px 16px",
        background: "var(--cds-layer-02)",
        borderRadius: 2,
        borderLeft: color ? `3px solid ${color}` : undefined,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1, color: color ?? "inherit" }}>
        {value}
      </div>
      <div
        style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}
        className={Classes.TEXT_MUTED}
      >
        {label}
      </div>
    </div>
  );
}

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function TaskOverduePanel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM11TaskOverdue(campaignId);

  return (
    <Panel
      id="m11-TOR"
      name="Task Overdue Rate"
      size="large"
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <KpiCard
              label="Overdue Rate"
              value={
                data.overdue_rate_percent != null
                  ? `${fmtPct.format(data.overdue_rate_percent)}%`
                  : "—"
              }
              color="#da1e28"
            />
            <KpiCard
              label="Overdue Tasks"
              value={fmtNum.format(data.overdue_count)}
              color="#da1e28"
            />
            <KpiCard
              label="Active Tasks"
              value={fmtNum.format(data.active_task_count)}
              color="var(--cds-interactive)"
            />
            <KpiCard
              label="Unscheduled"
              value={fmtNum.format(data.unscheduled_task_count)}
              color="#8d8d8d"
            />
          </div>
          <OverdueTaskTable tasks={data.tasks} />
        </div>
      )}
    </Panel>
  );
}
