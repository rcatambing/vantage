import { Callout, Spinner, HTMLTable, Classes, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import PhaseScheduleChart from "./components/PhaseScheduleChart";
import { useM13PhaseAdherence } from "./hooks/useM13PhaseAdherence";
import type { PhaseDirection } from "./types";

const DIRECTION_COLORS: Record<PhaseDirection, string> = {
  AHEAD: "#24a148",
  ON_TIME: "#6f6f6f",
  BEHIND: "#da1e28",
  PENDING: "#8d8d8d",
};

const fmtPct = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

interface KpiCardProps {
  label: string;
  value: string;
  color?: string;
}

function KpiCard({ label, value, color }: KpiCardProps) {
  return (
    <div
      style={{
        minWidth: 120,
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

export default function PhaseAdherencePanel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM13PhaseAdherence(campaignId);



  const overallColor =
    data?.metric != null
      ? data.metric >= 0
        ? "#da1e28"
        : "#24a148"
      : "#8d8d8d";

  return (
    <Panel
      id="m13-CPA"
      name="Campaign Phase Adherence"
      size="wide-large"
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
              label="Overall Variance (days)"
              value={
                data.metric != null
                  ? `${data.metric > 0 ? "+" : ""}${fmtPct.format(data.metric)}`
                  : "—"
              }
              color={overallColor}
            />
            <KpiCard
              label="Campaign Status"
              value={data.campaign_status}
              color="var(--cds-interactive)"
            />
          </div>

          {/* Phase schedule chart */}
          <PhaseScheduleChart phases={data.phases} />

          {/* Summary table */}
          <HTMLTable bordered style={{ fontSize: 12, width: "100%" }}>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Target Date</th>
                <th>Actual Date</th>
                <th>Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.phases.map((phase) => (
                <tr key={phase.phase}>
                  <td style={{ textTransform: "capitalize" }}>{phase.phase}</td>
                  <td>{formatDate(phase.target_date)}</td>
                  <td>{formatDate(phase.actual_date)}</td>
                  <td
                    style={{
                      color: DIRECTION_COLORS[phase.direction],
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {phase.variance_days != null
                      ? `${phase.variance_days > 0 ? "+" : ""}${phase.variance_days}d`
                      : "—"}
                  </td>
                  <td style={{ color: DIRECTION_COLORS[phase.direction], whiteSpace: "nowrap" }}>
                    {phase.direction}
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
