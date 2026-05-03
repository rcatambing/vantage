import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import IntelDensityBar from "./components/IntelDensityBar";
import { useM39 } from "./hooks/useM39";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M39Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM39(campaignId);

  return (
    <Panel
      id="m39"
      name="M39 — Regional Intel Density"
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
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view regional intel density data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* KPI strip */}
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
              <div style={{ fontSize: 32, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.overall_density.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                overall density
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: GRAY_50, lineHeight: 1 }}>
                {data.district_breakdown.length}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                districts
              </div>
            </div>
          </div>

          {/* Horizontal bar chart */}
          {data.district_breakdown.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <IntelDensityBar data={data.district_breakdown} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No intel density data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
