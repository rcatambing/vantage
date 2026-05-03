import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN08 } from "../hooks/useN08";

const BLUE_60 = "#0f62fe";
const BLUE_30 = "#a6c8ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N08Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN08(campaignId);

  return (
    <Panel
      id="n08"
      name="N08 — Derived Signal Dependency"
      size="small"
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
          Select a campaign to view dependency data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 400, color: BLUE_60, lineHeight: 1 }}>
              {data.dependency_display}
            </div>
            <div style={{ fontSize: 12, color: GRAY_50, marginTop: 8 }}>
              Derived Signal Dependency
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
              <div style={{ fontSize: 20, fontWeight: 600, color: BLUE_60 }}>
                {data.derived_signals}
              </div>
              <div>Derived</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: BLUE_30 }}>
                {data.manual_signals}
              </div>
              <div>Manual</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#f4f4f4" }}>
                {data.total_signals}
              </div>
              <div>Total</div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
