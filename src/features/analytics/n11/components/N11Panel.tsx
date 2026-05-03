import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN11 } from "../hooks/useN11";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function complianceColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate >= 80) return GREEN_40;
  if (rate >= 50) return YELLOW_40;
  return RED_40;
}

export default function N11Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN11(campaignId);

  return (
    <Panel
      id="n11"
      name="N11 — Leader Cadence Compliance"
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
        <div style={{ padding: 16, textAlign: "center", color: GRAY_50 }}>
          Select a campaign to view compliance data.
        </div>
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
                  color: complianceColor(data.compliance_rate),
                  lineHeight: 1,
                }}
              >
                {data.compliance_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Cadence Compliance
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.compliant_count} compliant</div>
              <div>{data.non_compliant_count} non-compliant</div>
              <div>{data.total_leaders} total</div>
            </div>
          </div>

          {data.level_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY INFLUENCE LEVEL</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Compliant</th>
                    <th style={{ textAlign: "right" }}>Required</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.level_breakdown.map((l) => (
                    <tr key={l.influence_level}>
                      <td>{l.influence_level}</td>
                      <td style={{ textAlign: "right" }}>{l.total_leaders}</td>
                      <td style={{ textAlign: "right" }}>{l.compliant}</td>
                      <td style={{ textAlign: "right" }}>{l.required_events}/{l.window_days}d</td>
                      <td style={{ textAlign: "right", color: complianceColor(l.compliance_rate) }}>
                        {l.compliance_display}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}

          {data.non_compliant_leaders.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>
                NON-COMPLIANT LEADERS ({data.non_compliant_leaders.length})
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Leader</th>
                    <th>Level</th>
                    <th style={{ textAlign: "right" }}>Events</th>
                    <th style={{ textAlign: "right" }}>Required</th>
                  </tr>
                </thead>
                <tbody>
                  {data.non_compliant_leaders.map((l) => (
                    <tr key={l.leader_id}>
                      <td>{l.leader_name}</td>
                      <td>{l.influence_level}</td>
                      <td style={{ textAlign: "right", color: RED_40 }}>{l.events_in_window}</td>
                      <td style={{ textAlign: "right" }}>{l.required_events}</td>
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
