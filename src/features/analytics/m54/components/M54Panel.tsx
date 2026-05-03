import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useM54 } from "../hooks/useM54";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function complianceColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate >= 90) return GREEN_40;
  if (rate >= 70) return YELLOW_30;
  return RED_40;
}

export default function M54Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM54(campaignId);

  return (
    <Panel
      id="m54"
      name="M54 — Ticket SLA Compliance"
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
          Select a campaign to view SLA compliance data.
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
                SLA compliance rate
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.compliant} compliant</div>
              <div>{data.breached} breached</div>
              <div>{data.total_with_sla} total with SLA</div>
            </div>
          </div>

          {data.severity_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>
                BY SEVERITY
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Compliant</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.severity_breakdown.map((s) => (
                    <tr key={s.severity}>
                      <td>{s.severity}</td>
                      <td style={{ textAlign: "right" }}>{s.total_with_sla}</td>
                      <td style={{ textAlign: "right" }}>{s.compliant}</td>
                      <td style={{ textAlign: "right", color: complianceColor(s.compliance_rate) }}>
                        {s.compliance_display}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}

          {data.breach_list.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>
                BREACHES ({data.breach_list.length})
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Severity</th>
                    <th style={{ textAlign: "right" }}>Hours Over</th>
                  </tr>
                </thead>
                <tbody>
                  {data.breach_list.slice(0, 5).map((b) => (
                    <tr key={b.ticket_id}>
                      <td>{b.title}</td>
                      <td>{b.severity}</td>
                      <td style={{ textAlign: "right", color: RED_40 }}>
                        {b.hours_over_sla}h
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
