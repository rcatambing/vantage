import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN10 } from "../hooks/useN10";

const GREEN_40 = "#42be65";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function activationColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate >= 80) return GREEN_40;
  return RED_40;
}

export default function N10Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN10(campaignId);

  return (
    <Panel
      id="n10"
      name="N10 — Key Influencer Activation"
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
          Select a campaign to view activation data.
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
                  color: activationColor(data.activation_rate),
                  lineHeight: 1,
                }}
              >
                {data.activation_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Activation Rate ({data.days_window}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.activated_count} activated</div>
              <div>{data.total_key_influencers} key influencers</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY DISTRICT</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Activated</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>District {d.district_id}</td>
                      <td style={{ textAlign: "right" }}>{d.total_key_influencers}</td>
                      <td style={{ textAlign: "right" }}>{d.activated}</td>
                      <td style={{ textAlign: "right", color: activationColor(d.activation_rate) }}>
                        {d.activation_display}
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
