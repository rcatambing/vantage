import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN25 } from "../hooks/useN25";

const RED_40 = "#ff8389";
const YELLOW_40 = "#f1c21b";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function severityColor(hours: number): string {
  if (hours <= 4) return GRAY_50;
  if (hours <= 24) return YELLOW_40;
  return RED_40;
}

export default function N25Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN25(campaignId);

  return (
    <Panel
      id="n25"
      name="N25 — SLA Breach Lead Time"
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
                  color: data.median_hours != null ? severityColor(data.median_hours) : GRAY_50,
                  lineHeight: 1,
                }}
              >
                {data.median_hours != null ? `${data.median_hours}h` : "N/A"}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Median Breach Hours
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.breach_count} breached tickets</div>
              <div>P75: {data.p75_hours != null ? `${data.p75_hours}h` : "N/A"}</div>
              <div>P90: {data.p90_hours != null ? `${data.p90_hours}h` : "N/A"}</div>
            </div>
          </div>

          {data.severity_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY SEVERITY</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th style={{ textAlign: "right" }}>Breaches</th>
                    <th style={{ textAlign: "right" }}>Median Hours</th>
                    <th style={{ textAlign: "right" }}>Max Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {data.severity_breakdown.map((s) => (
                    <tr key={s.severity}>
                      <td>{s.severity}</td>
                      <td style={{ textAlign: "right" }}>{s.breach_count}</td>
                      <td style={{ textAlign: "right", color: severityColor(s.median_hours) }}>
                        {s.median_hours}h
                      </td>
                      <td style={{ textAlign: "right" }}>{s.max_hours}h</td>
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
