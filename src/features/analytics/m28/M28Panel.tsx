import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import CoverageBarChart from "./components/CoverageBarChart";
import { useM28 } from "./hooks/useM28";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M28Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM28(campaignId);

  return (
    <Panel
      id="m28"
      name="M28 — Staff Assignment Coverage"
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
          Select a campaign to view staff assignment coverage data.
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
                {data.coverage_rate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                coverage rate
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.covered_districts}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                covered districts
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: GRAY_50, lineHeight: 1 }}>
                {data.total_districts}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                total districts
              </div>
            </div>
          </div>

          {/* Coverage bars */}
          {data.by_district_type.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <CoverageBarChart data={data.by_district_type} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No district coverage data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
