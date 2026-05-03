import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN22 } from "../hooks/useN22";

const GREEN_40 = "#42be65";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N22Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN22(campaignId);

  return (
    <Panel
      id="n22"
      name="N22 — Primary Assignment Utilization"
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
                  color: data.utilization_rate != null && data.utilization_rate >= 50 ? GREEN_40 : GRAY_50,
                  lineHeight: 1,
                }}
              >
                {data.utilization_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Utilization ({data.days_window}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_primary_assignments} primary assignments</div>
              <div>{data.utilized_count} utilized</div>
            </div>
          </div>

          {data.staff_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>STAFF BREAKDOWN</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Staff</th>
                    <th style={{ textAlign: "right" }}>Assignments</th>
                    <th style={{ textAlign: "right" }}>Completed Tasks</th>
                    <th>Utilized</th>
                  </tr>
                </thead>
                <tbody>
                  {data.staff_breakdown.map((s) => (
                    <tr key={s.staff_id}>
                      <td>{s.staff_code}</td>
                      <td style={{ textAlign: "right" }}>{s.assignment_count}</td>
                      <td style={{ textAlign: "right" }}>{s.completed_tasks}</td>
                      <td style={{ color: s.utilized ? GREEN_40 : GRAY_50 }}>
                        {s.utilized ? "Yes" : "No"}
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
