import { Spinner, NonIdealState, Button, Classes, Callout } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import ResponseFunnel from "./components/ResponseFunnel";
import { useM24 } from "./hooks/useM24";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M24Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM24(campaignId);

  return (
    <Panel
      id="m24"
      name="M24 — Poll Response Rate"
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
          Select a campaign to view response rate data.
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
                color: data.response_rate != null ? BLUE_40 : GRAY_50,
              }}
            >
              {data.response_rate != null ? `${data.response_rate}%` : "—"}
            </div>
            <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
              response rate
            </div>
            <div style={{ fontSize: 12, color: "#6f6f6f", marginTop: 2 }}>
              {data.responded_count.toLocaleString()} of {data.invited_count.toLocaleString()} participants
            </div>
          </div>

          {/* Funnel */}
          {data.invited_count > 0 ? (
            <div style={{ padding: "16px 16px 8px" }}>
              <ResponseFunnel
                invitedCount={data.invited_count}
                respondedCount={data.responded_count}
              />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No participant data available.
            </div>
          )}

          {/* v1 limitation callout */}
          <div style={{ padding: "0 16px 8px" }}>
            <Callout intent="none" style={{ fontSize: 12 }}>
              Respondent-level completion data unavailable — requires poll session linkage.
            </Callout>
          </div>
        </div>
      )}
    </Panel>
  );
}
