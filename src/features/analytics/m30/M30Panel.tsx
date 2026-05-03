import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import RatingHistogram from "./components/RatingHistogram";
import { useM30 } from "./hooks/useM30";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M30Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM30(campaignId);

  return (
    <Panel
      id="m30"
      name="M30 — Average Task Completion Rating"
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
          Select a campaign to view average task completion rating data.
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
                {data.overall_avg != null ? data.overall_avg.toFixed(1) : "—"}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                overall average rating
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.rated_count}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                rated tasks
              </div>
            </div>
          </div>

          {/* Histogram */}
          {data.staff_breakdown.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <RatingHistogram data={data.staff_breakdown} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No rating data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
