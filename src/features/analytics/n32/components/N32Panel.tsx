import { Spinner, NonIdealState, Button, HTMLTable, Tag } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN32 } from "../hooks/useN32";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function riskColor(score: number): string {
  if (score < 40) return GREEN_40;
  if (score < 70) return YELLOW_40;
  return RED_40;
}

export default function N32Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN32(campaignId);

  return (
    <Panel
      id="n32"
      name="N32 — Election-Day Risk Heat"
      size="wide-large"
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
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1, color: riskColor(data.overall_risk) }}>
                {data.overall_risk}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>Overall Risk Score</div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>Threshold: {data.risk_threshold}</div>
          </div>

          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>District</th>
                <th style={{ textAlign: "right" }}>Ticket Density</th>
                <th style={{ textAlign: "right" }}>Staffing Gap</th>
                <th style={{ textAlign: "right" }}>Signal Expiry</th>
                <th style={{ textAlign: "right" }}>Reschedule</th>
                <th style={{ textAlign: "right" }}>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.district_breakdown.map((d) => (
                <tr key={d.district_id}>
                  <td>{d.district_name}</td>
                  <td style={{ textAlign: "right" }}>{d.severe_ticket_density}</td>
                  <td style={{ textAlign: "right" }}>{d.staffing_gap}%</td>
                  <td style={{ textAlign: "right" }}>{d.expiring_signal_rate}%</td>
                  <td style={{ textAlign: "right" }}>{d.reschedule_volatility}%</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: riskColor(d.risk_score) }}>
                    {d.risk_score}
                  </td>
                  <td>
                    {d.flagged ? (
                      <Tag intent="danger" minimal>FLAGGED</Tag>
                    ) : (
                      <Tag intent="success" minimal>OK</Tag>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
