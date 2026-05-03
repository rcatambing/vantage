import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN17 } from "../hooks/useN17";

const GREEN_40 = "#42be65";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N17Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN17(campaignId);

  return (
    <Panel
      id="n17"
      name="N17 — Undecided Resolution Rate"
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
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 400,
                  color: data.resolution_rate != null && data.resolution_rate >= 50 ? GREEN_40 : GRAY_50,
                  lineHeight: 1,
                }}
              >
                {data.resolution_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Resolution Rate ({data.period_days}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.persuadable_at_start} persuadable at start</div>
              <div>{data.resolved_to_decided} resolved to decided</div>
              <div style={{ color: GREEN_40 }}>{data.resolved_for} for</div>
              <div style={{ color: RED_40 }}>{data.resolved_against} against</div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
