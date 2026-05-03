import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import EvaluationTypeBars from "./components/EvaluationTypeBars";
import { useM31 } from "./hooks/useM31";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M31Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM31(campaignId);

  return (
    <Panel
      id="m31"
      name="M31 — Staff Evaluation Score"
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
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view staff evaluation score data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* KPI strip */}
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
              <div style={{ fontSize: 32, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.overall_avg != null ? data.overall_avg.toFixed(1) : "—"}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                overall evaluation avg
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.total_evaluations}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                total evaluations
              </div>
            </div>
          </div>

          {/* Evaluation type bars */}
          {data.by_evaluation_type.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <EvaluationTypeBars data={data.by_evaluation_type} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No evaluation data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
