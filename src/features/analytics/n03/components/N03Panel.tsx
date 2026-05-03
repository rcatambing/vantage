import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN03 } from "../hooks/useN03";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function riskColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate <= 10) return GREEN_40;
  if (rate <= 25) return YELLOW_40;
  return RED_40;
}

export default function N03Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN03(campaignId);

  return (
    <Panel
      id="n03"
      name="N03 — Signal Expiry Risk Rate"
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
          Select a campaign to view expiry risk data.
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
                  color: riskColor(data.expiry_risk),
                  lineHeight: 1,
                }}
              >
                {data.expiry_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Expiry Risk ({data.days_threshold}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_active_signals} active</div>
              <div>{data.expiring_count} expiring</div>
              <div>{data.expired_count} expired</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY LOCATION</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th style={{ textAlign: "right" }}>Active</th>
                    <th style={{ textAlign: "right" }}>Expiring</th>
                    <th style={{ textAlign: "right" }}>Expired</th>
                    <th style={{ textAlign: "right" }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td style={{ textAlign: "right" }}>{d.active}</td>
                      <td style={{ textAlign: "right", color: YELLOW_40 }}>{d.expiring}</td>
                      <td style={{ textAlign: "right", color: RED_40 }}>{d.expired}</td>
                      <td style={{ textAlign: "right", color: riskColor(d.expiry_risk) }}>
                        {d.expiry_display}
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
