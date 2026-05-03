import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN12 } from "../hooks/useN12";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function yieldColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate >= 70) return GREEN_40;
  if (rate >= 40) return YELLOW_40;
  return RED_40;
}

export default function N12Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN12(campaignId);

  return (
    <Panel
      id="n12"
      name="N12 — Leader Commitment Yield"
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
                  color: yieldColor(data.yield_rate),
                  lineHeight: 1,
                }}
              >
                {data.yield_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Commitment Yield
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_commitments} commitments</div>
              <div>{data.delivered_count} delivered</div>
              <div>{data.pending_count} pending</div>
            </div>
          </div>

          {data.status_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>OUTCOME STATUS</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Count</th>
                    <th style={{ textAlign: "right" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {data.status_breakdown.map((s) => (
                    <tr key={s.outcome_status}>
                      <td>{s.outcome_status}</td>
                      <td style={{ textAlign: "right" }}>{s.count}</td>
                      <td style={{ textAlign: "right" }}>{s.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}

          {data.leader_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>
                TOP LEADERS BY YIELD
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Leader</th>
                    <th>Level</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Delivered</th>
                    <th style={{ textAlign: "right" }}>Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leader_breakdown.map((l) => (
                    <tr key={l.leader_id}>
                      <td>{l.leader_name}</td>
                      <td>{l.influence_level}</td>
                      <td style={{ textAlign: "right" }}>{l.total_commitments}</td>
                      <td style={{ textAlign: "right" }}>{l.delivered}</td>
                      <td style={{ textAlign: "right", color: yieldColor(l.yield_rate) }}>
                        {l.yield_rate}%
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
