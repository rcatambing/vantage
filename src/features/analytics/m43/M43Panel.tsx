import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import CanvassProgressChart from "./components/CanvassProgressChart";
import { useM43 } from "./hooks/useM43";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function overallColor(rate: number | null): string {
  if (rate == null) return "#8d8d8d";
  if (rate >= 80) return GREEN_40;
  if (rate >= 50) return YELLOW_30;
  return RED_40;
}

export default function M43Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM43(campaignId);

  return (
    <Panel
      id="m43"
      name="M43 — Door-to-Door Canvass Rate"
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
        <NonIdealState icon="error" title="Failed to load" description={error} />
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          <div
            style={{
              height: 72,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
              gap: 32,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Overall Canvass Rate</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: overallColor(data.overall_canvass_rate) }}>{data.overall_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Visited</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_houses_visited.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Targeted</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_houses_targeted.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Remaining</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: data.total_remaining > 0 ? RED_40 : GREEN_40 }}>{data.total_remaining.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <CanvassProgressChart districts={data.district_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
