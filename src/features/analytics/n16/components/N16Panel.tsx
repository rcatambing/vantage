import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN16 } from "../hooks/useN16";

const GREEN_40 = "#42be65";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function velocityColor(v: number | null): string {
  if (v == null) return GRAY_50;
  if (v > 0) return GREEN_40;
  if (v < 0) return RED_40;
  return GRAY_50;
}

export default function N16Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN16(campaignId);

  return (
    <Panel
      id="n16"
      name="N16 — Persuasion Velocity"
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
                  color: velocityColor(data.velocity),
                  lineHeight: 1,
                }}
              >
                {data.velocity_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Net Velocity ({data.period_days}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>+{data.moved_to_supporter} to supporter</div>
              <div>-{data.moved_out_of_supporter} from supporter</div>
              <div>{data.start_persuadable_count} persuadable at start</div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
