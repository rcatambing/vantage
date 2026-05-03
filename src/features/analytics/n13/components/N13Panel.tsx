import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN13 } from "../hooks/useN13";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function pressureColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate <= 1) return GREEN_40;
  if (rate <= 3) return YELLOW_40;
  return RED_40;
}

export default function N13Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN13(campaignId);

  return (
    <Panel
      id="n13"
      name="N13 — Leader Issue Escalation Pressure"
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
                  color: pressureColor(data.pressure_rate),
                  lineHeight: 1,
                }}
              >
                {data.pressure_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Issues per Leader
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_issue_events} issue events</div>
              <div>{data.total_active_leaders} active leaders</div>
              <div>{data.lookback_days}d lookback</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>DISTRICT PRESSURE</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Issues</th>
                    <th style={{ textAlign: "right" }}>Leaders</th>
                    <th style={{ textAlign: "right" }}>Pressure</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>District {d.district_id}</td>
                      <td style={{ textAlign: "right" }}>{d.issue_count}</td>
                      <td style={{ textAlign: "right" }}>{d.active_leaders}</td>
                      <td style={{ textAlign: "right", color: pressureColor(d.pressure_rate) }}>
                        {d.pressure_rate.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}

          {data.leader_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>
                TOP ISSUE GENERATORS
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Leader</th>
                    <th>Level</th>
                    <th style={{ textAlign: "right" }}>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leader_breakdown.map((l) => (
                    <tr key={l.leader_id}>
                      <td>{l.leader_name}</td>
                      <td>{l.influence_level}</td>
                      <td style={{ textAlign: "right" }}>{l.issue_count}</td>
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
