import { Spinner, NonIdealState, Button, Classes, Tag } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import IssueSalienceBarChart from "./components/IssueSalienceBarChart";
import { useM20 } from "./hooks/useM20";

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M20Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM20(campaignId, 10);

  return (
    <Panel
      id="m20"
      name="M20 — Issue Salience Ranking"
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
          Select a campaign to view issue salience data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Summary row */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Tag minimal>
              {fmtNum.format(data.total_distinct_issues)} distinct issues
            </Tag>
            <Tag minimal>
              {fmtNum.format(data.total_responses_used)} responses
            </Tag>
          </div>

          {/* Bar chart */}
          <IssueSalienceBarChart rankedIssues={data.ranked_issues} />
        </div>
      )}
    </Panel>
  );
}
