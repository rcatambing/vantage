import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN18 } from "../hooks/useN18";

const GREEN_40 = "#42be65";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N18Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN18(campaignId);

  return (
    <Panel
      id="n18"
      name="N18 — Soft Opponent Flip Rate"
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
                  color: data.flip_rate != null && data.flip_rate > 0 ? GREEN_40 : GRAY_50,
                  lineHeight: 1,
                }}
              >
                {data.flip_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Flip Rate ({data.period_days}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.lean_opponents_contacted} contacted</div>
              <div>{data.flipped_count} flipped</div>
              <div>{data.flipped_to_supporter} → supporter</div>
              <div>{data.flipped_to_persuadable} → persuadable</div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
