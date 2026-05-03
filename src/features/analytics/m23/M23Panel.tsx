import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import CompletionRateChart from "./components/CompletionRateChart";
import { useM23 } from "./hooks/useM23";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M23Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM23(campaignId);

  return (
    <Panel
      id="m23"
      name="M23 — Poll Completion Rate"
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
          Select a campaign to view poll completion data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* KPI strip */}
          <div
            style={{
              height: 72,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1,
                color: data.completion_rate != null ? BLUE_40 : GRAY_50,
              }}
            >
              {data.completion_rate != null ? `${data.completion_rate}%` : "—"}
            </div>
            <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
              of sessions completed
            </div>
            <div style={{ fontSize: 12, color: "#6f6f6f", marginTop: 2 }}>
              {data.completed_count} / {data.total_sessions} sessions
            </div>
          </div>

          {/* Per-poll bar chart */}
          {data.polls.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <CompletionRateChart polls={data.polls} overallRate={data.completion_rate} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No poll session data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
