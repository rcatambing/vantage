import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN24 } from "../hooks/useN24";

const RED_40 = "#ff8389";
const BLUE_60 = "#0f62fe";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N24Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN24(campaignId);

  return (
    <Panel
      id="n24"
      name="N24 — Task Cancellation Shock Index"
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
                  color: data.shock_rate > 20 ? RED_40 : BLUE_60,
                  lineHeight: 1,
                }}
              >
                {data.shock_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Cancellation Shock
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_done_tasks} done tasks</div>
              <div>{data.cancelled_done_tasks} cancelled</div>
              <div>{data.genuine_done_tasks} genuine</div>
            </div>
          </div>

          {data.objective_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>OBJECTIVE BREAKDOWN</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Objective</th>
                    <th style={{ textAlign: "right" }}>Total Done</th>
                    <th style={{ textAlign: "right" }}>Cancelled</th>
                    <th style={{ textAlign: "right" }}>Genuine</th>
                    <th style={{ textAlign: "right" }}>Shock Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.objective_breakdown.map((o) => (
                    <tr key={o.objective_id}>
                      <td>{o.objective_title}</td>
                      <td style={{ textAlign: "right" }}>{o.total_done}</td>
                      <td style={{ textAlign: "right", color: RED_40 }}>{o.cancelled_done}</td>
                      <td style={{ textAlign: "right", color: BLUE_60 }}>{o.genuine_done}</td>
                      <td style={{ textAlign: "right", color: o.shock_rate > 20 ? RED_40 : GRAY_50 }}>
                        {o.shock_rate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
