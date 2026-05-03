import { Callout, Spinner, Classes, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import DonutChart from "./components/DonutChart";
import DonutLegend from "./components/DonutLegend";
import { useM15ActiveCampaigns } from "./hooks/useM15ActiveCampaigns";

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  onRemove?: () => void;
}

export default function ActiveCampaignPanel({ onRemove }: Props) {
  const { data, loading, error, refetch } = useM15ActiveCampaigns();

  const activeRate =
    data && data.total_count > 0
      ? ((data.active_count / data.total_count) * 100).toFixed(0)
      : null;

  return (
    <Panel
      id="m15-ACC"
      name="Active Campaign Count"
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
          {/* Top KPI */}
          <div
            style={{
              padding: "8px 16px",
              background: "var(--cds-layer-02)",
              borderRadius: 2,
              borderLeft: "3px solid var(--cds-interactive)",
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 300, lineHeight: 1, color: "var(--cds-interactive)" }}>
              {fmtNum.format(data.active_count)}
            </div>
            <div
              style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}
              className={Classes.TEXT_MUTED}
            >
              Active Campaigns{activeRate != null ? ` · ${activeRate}% of ${fmtNum.format(data.total_count)}` : ""}
            </div>
          </div>

          {/* Donut chart */}
          <DonutChart byStatus={data.by_status} total={data.total_count} size={130} strokeWidth={20} />

          {/* Legend */}
          <DonutLegend byStatus={data.by_status} />
        </div>
      )}
    </Panel>
  );
}
