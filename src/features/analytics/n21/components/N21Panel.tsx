import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN21 } from "../hooks/useN21";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function statusColor(status: string): string {
  if (status === "ADEQUATE") return GREEN_40;
  if (status === "THIN") return YELLOW_40;
  return RED_40;
}

export default function N21Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN21(campaignId);

  return (
    <Panel
      id="n21"
      name="N21 — Barangay Workforce Saturation"
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
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1 }}>
                {data.overall_saturation}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Staff per 1,000 Voters
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_staff} staff</div>
              <div>{data.total_voters} voters</div>
              <div>{data.barangay_count} barangays</div>
            </div>
          </div>

          {data.barangay_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BARANGAY SATURATION</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Barangay</th>
                    <th>City</th>
                    <th style={{ textAlign: "right" }}>Staff</th>
                    <th style={{ textAlign: "right" }}>Voters</th>
                    <th style={{ textAlign: "right" }}>Saturation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.barangay_breakdown.map((b) => (
                    <tr key={b.district_id}>
                      <td>{b.barangay_name}</td>
                      <td>{b.city}</td>
                      <td style={{ textAlign: "right" }}>{b.staff_count}</td>
                      <td style={{ textAlign: "right" }}>{b.voter_count}</td>
                      <td style={{ textAlign: "right" }}>{b.saturation}</td>
                      <td style={{ color: statusColor(b.status) }}>{b.status}</td>
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
