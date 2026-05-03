import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import NetFavorabilityChart from "./components/NetFavorabilityChart";
import { useM19 } from "./hooks/useM19";

const fmtPct = (val: number | null): string =>
  val != null ? `${val.toFixed(1)}%` : "—";

function netColor(val: number | null): string {
  if (val == null) return "#888";
  if (val > 0) return "#4CAF50";
  if (val < 0) return "#E53935";
  return "#888";
}

interface KpiProps {
  label: string;
  value: string;
  color?: string;
}

function KpiCard({ label, value, color }: KpiProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 88,
        padding: "8px 12px",
        background: "var(--cds-layer-02)",
        borderRadius: 2,
        borderLeft: color ? `3px solid ${color}` : undefined,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.1, color: color ?? "inherit" }}>
        {value}
      </div>
      <div
        style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}
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

export default function M19Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM19(campaignId);

  return (
    <Panel
      id="m19"
      name="M19 — Net Favorability"
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
        <NonIdealState
          icon="error"
          title="Failed to load"
          description={error}
        />
      )}
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view net favorability data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* KPI row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <KpiCard
              label="Net Favorability"
              value={
                data.net_favorability != null
                  ? `${data.net_favorability > 0 ? "+" : ""}${fmtPct(data.net_favorability)}`
                  : "—"
              }
              color={netColor(data.net_favorability)}
            />
            <KpiCard
              label="Favorable"
              value={fmtPct(data.favorability_rate)}
              color="#4CAF50"
            />
            <KpiCard
              label="Unfavorable"
              value={fmtPct(data.unfavorability_rate)}
              color="#E53935"
            />
          </div>

          {/* Trend line chart */}
          {data.trend.length > 0 && (
            <NetFavorabilityChart trend={data.trend} />
          )}
        </div>
      )}
    </Panel>
  );
}
