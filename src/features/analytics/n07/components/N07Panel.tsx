import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN07 } from "../hooks/useN07";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function conflictColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate <= 5) return GREEN_40;
  if (rate <= 15) return YELLOW_40;
  return RED_40;
}

export default function N07Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN07(campaignId);

  return (
    <Panel
      id="n07"
      name="N07 — Conflicting Signal Ratio"
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
        <div style={{ padding: 16, textAlign: "center", color: GRAY_50 }}>
          Select a campaign to view conflict data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 400,
                color: conflictColor(data.conflict_ratio),
                lineHeight: 1,
              }}
            >
              {data.conflict_display}
            </div>
            <div style={{ fontSize: 12, color: GRAY_50, marginTop: 8 }}>
              Conflicting Signal Ratio
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              marginTop: 24,
              fontSize: 11,
              color: GRAY_50,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#f4f4f4" }}>
                {data.total_voters_with_signals}
              </div>
              <div>With Signals</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: RED_40 }}>
                {data.conflicting_voters}
              </div>
              <div>Conflicting</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#f4f4f4" }}>
                {data.confidence_threshold}
              </div>
              <div>Confidence ≥</div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
