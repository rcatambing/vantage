import { Callout, Spinner, Classes, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import ObjectiveBarChart from "./components/ObjectiveBarChart";
import ObjectiveDrillTable from "./components/ObjectiveDrillTable";
import { useM16ObjTaskRatio } from "./hooks/useM16ObjTaskRatio";

const fmtNum = new Intl.NumberFormat("en-PH");
const fmtDec = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface KpiCardProps {
  label: string;
  value: string;
  color?: string;
}

function KpiCard({ label, value, color }: KpiCardProps) {
  return (
    <div
      style={{
        minWidth: 100,
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

export default function ObjectiveTaskRatioPanel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM16ObjTaskRatio(campaignId);

  const average =
    data && data.objective_count > 0 ? data.task_count / data.objective_count : 0;

  return (
    <Panel
      id="m16-OTR"
      name="Objective-to-Task Ratio"
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
          {/* KPI row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <KpiCard
              label="Avg Tasks/Objective"
              value={data.ratio != null ? fmtDec.format(data.ratio) : "—"}
              color="var(--cds-interactive)"
            />
            <KpiCard
              label="Objectives"
              value={fmtNum.format(data.objective_count)}
              color="var(--cds-interactive)"
            />
            <KpiCard
              label="Total Tasks"
              value={fmtNum.format(data.task_count)}
              color="#8d8d8d"
            />
            <KpiCard
              label="Objectives w/o Tasks"
              value={fmtNum.format(data.objectives_with_no_tasks)}
              color={data.objectives_with_no_tasks > 0 ? "#da1e28" : "#24a148"}
            />
          </div>

          {/* Bar chart */}
          <ObjectiveBarChart objectives={data.by_objective} average={average} />

          {/* Drill table */}
          <ObjectiveDrillTable objectives={data.by_objective} />
        </div>
      )}
    </Panel>
  );
}
