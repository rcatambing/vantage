import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN06 } from "../hooks/useN06";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function volatilityColor(rate: number | null): string {
  if (rate == null) return GRAY_50;
  if (rate <= 10) return GREEN_40;
  if (rate <= 25) return YELLOW_40;
  return RED_40;
}

export default function N06Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN06(campaignId);

  return (
    <Panel
      id="n06"
      name="N06 — Affiliation Volatility Rate"
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
          Select a campaign to view volatility data.
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
                  color: volatilityColor(data.volatility_rate),
                  lineHeight: 1,
                }}
              >
                {data.volatility_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Volatility Rate ({data.days_lookback}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.volatile_voters} volatile</div>
              <div>{data.total_affiliated_voters} affiliated</div>
            </div>
          </div>

          {data.type_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY TYPE</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Affiliated</th>
                    <th style={{ textAlign: "right" }}>Volatile</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.type_breakdown.map((t) => (
                    <tr key={t.affiliation_type}>
                      <td>{t.affiliation_type_name}</td>
                      <td style={{ textAlign: "right" }}>{t.total_affiliated}</td>
                      <td style={{ textAlign: "right" }}>{t.volatile_count}</td>
                      <td style={{ textAlign: "right", color: volatilityColor(t.volatility_rate) }}>
                        {t.volatility_display}
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
