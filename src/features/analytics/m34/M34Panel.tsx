import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import RetentionStackedBar from "./components/RetentionStackedBar";
import { useM34 } from "./hooks/useM34";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M34Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM34(campaignId);

  return (
    <Panel
      id="m34"
      name="M34 — Volunteer Retention Rate"
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
        <NonIdealState icon="error" title="Failed to load" description={error} />
      )}
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view volunteer retention rate data.
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
                {data.retention_rate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                retention rate
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.active_count}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                active
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: GRAY_50, lineHeight: 1 }}>
                {data.total_count}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                total
              </div>
            </div>
          </div>

          {/* Stacked bar chart */}
          {data.by_staff_type.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <RetentionStackedBar data={data.by_staff_type} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No staff retention data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
