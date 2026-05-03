import { Spinner, NonIdealState, Button, Classes, Tag } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import DistrictSentimentChart from "./components/DistrictSentimentChart";
import { useM22 } from "./hooks/useM22";

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M22Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM22(campaignId);

  return (
    <Panel
      id="m22"
      name="M22 — Regional Sentiment Variance"
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
          Select a campaign to view regional sentiment data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Summary row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Tag minimal>
              {data.districts.length} districts
            </Tag>
            <Tag minimal>
              {fmtNum.format(data.total_eligible_responses)} responses
            </Tag>
            {data.unmapped_count > 0 && (
              <Tag minimal intent="warning">
                {fmtNum.format(data.unmapped_count)} unmapped
              </Tag>
            )}
            <span
              className={Classes.TEXT_MUTED}
              style={{ fontSize: 11, textTransform: "capitalize" }}
            >
              by {data.district_type}
            </span>
          </div>

          {/* District bar chart */}
          <DistrictSentimentChart districts={data.districts} />
        </div>
      )}
    </Panel>
  );
}
