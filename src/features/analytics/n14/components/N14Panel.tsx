import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN14 } from "../hooks/useN14";

const GREEN_40 = "#42be65";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function gapColor(gap: number): string {
  if (gap < 0) return GREEN_40;
  if (gap > 0) return RED_40;
  return GRAY_50;
}

export default function N14Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN14(campaignId);

  return (
    <Panel
      id="n14"
      name="N14 — Influence-Weighted Leader Coverage Gap"
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
                  color: gapColor(data.total_gap),
                  lineHeight: 1,
                }}
              >
                {data.total_gap > 0 ? `+${data.total_gap}` : data.total_gap}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Total Gap
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>Target: {data.total_target_points}</div>
              <div>Current: {data.total_current_points}</div>
              <div>{data.district_count} districts</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>DISTRICT GAPS</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Target</th>
                    <th style={{ textAlign: "right" }}>Current</th>
                    <th style={{ textAlign: "right" }}>Gap</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>District {d.district_id}</td>
                      <td style={{ textAlign: "right" }}>{d.target_points}</td>
                      <td style={{ textAlign: "right" }}>{d.current_points}</td>
                      <td style={{ textAlign: "right", color: gapColor(d.gap) }}>
                        {d.gap > 0 ? `+${d.gap}` : d.gap}
                      </td>
                      <td>{d.gap_status}</td>
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
