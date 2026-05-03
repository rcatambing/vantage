import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN26 } from "../hooks/useN26";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function volatilityColor(rate: number): string {
  if (rate <= 5) return GREEN_40;
  if (rate <= 15) return YELLOW_40;
  return RED_40;
}

export default function N26Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN26(campaignId);

  return (
    <Panel
      id="n26"
      name="N26 — Activity Reschedule Volatility"
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
                  color: volatilityColor(data.volatility_rate),
                  lineHeight: 1,
                }}
              >
                {data.volatility_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Reschedule Rate ({data.lookback_days}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_activities} activities</div>
              <div>{data.rescheduled_count} rescheduled</div>
            </div>
          </div>

          {data.type_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY ACTIVITY TYPE</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Rescheduled</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.type_breakdown.map((t) => (
                    <tr key={t.activity_type}>
                      <td>{t.activity_type}</td>
                      <td style={{ textAlign: "right" }}>{t.total_activities}</td>
                      <td style={{ textAlign: "right" }}>{t.rescheduled_count}</td>
                      <td style={{ textAlign: "right", color: volatilityColor(t.volatility_rate) }}>
                        {t.volatility_rate}%
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
