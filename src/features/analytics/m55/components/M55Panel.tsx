import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useM55 } from "../hooks/useM55";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function escalationColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate <= 10) return GREEN_40;
  if (rate <= 25) return YELLOW_30;
  return RED_40;
}

export default function M55Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM55(campaignId);

  return (
    <Panel
      id="m55"
      name="M55 — Escalation Rate"
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
          Select a campaign to view escalation rate data.
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
                  color: escalationColor(data.escalation_rate),
                  lineHeight: 1,
                }}
              >
                {data.escalation_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                escalation rate
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.escalated_count} escalated</div>
              <div>{data.total_tickets} total tickets</div>
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
                    <th style={{ textAlign: "right" }}>Escalated</th>
                  </tr>
                </thead>
                <tbody>
                  {data.severity_breakdown.map((s) => (
                    <tr key={s.severity}>
                      <td>{s.severity}</td>
                      <td style={{ textAlign: "right" }}>{s.escalated_count}</td>
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
