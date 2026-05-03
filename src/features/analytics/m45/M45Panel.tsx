import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import EngagementBarChart from "./components/EngagementBarChart";
import { useM45 } from "./hooks/useM45";

const BLUE_60 = "#0f62fe";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M45Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM45(campaignId);

  return (
    <Panel
      id="m45"
      name="M45 — Social Media Engagement"
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Overall Engagement</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: BLUE_60 }}>{data.overall_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Followers</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_followers.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Platforms</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.platform_count}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Total Posts</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_posts.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <EngagementBarChart platforms={data.platform_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
