import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import ActivityVolumeChart from "./components/ActivityVolumeChart";
import { useM47 } from "./hooks/useM47";

const BLUE_60 = "#0f62fe";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M47Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM47(campaignId);

  return (
    <Panel
      id="m47"
      name="M47 — Feed Activity Volume"
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Total Activity</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: BLUE_60 }}>{data.total_activity.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Posts</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_posts.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Comments</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_comments.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Avg / Period</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.avg_per_period}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <ActivityVolumeChart timeline={data.timeline} />
          </div>
        </div>
      )}
    </Panel>
  );
}
