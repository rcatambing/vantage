import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN35 } from "../hooks/useN35";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function rateColor(rate: number): string {
  if (rate >= 20) return GREEN_40;
  if (rate >= 10) return YELLOW_40;
  return RED_40;
}

export default function N35Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN35(campaignId);

  return (
    <Panel
      id="n35"
      name="N35 — Income Bracket Conversion Rate"
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
              height: 48,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 11, color: GRAY_50 }}>Period: {data.period_days} days</div>
          </div>

          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>Income Bracket</th>
                <th style={{ textAlign: "right" }}>Start Persuadable</th>
                <th style={{ textAlign: "right" }}>Converted</th>
                <th style={{ textAlign: "right" }}>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.breakdown.map((b) => (
                <tr key={b.income_bracket}>
                  <td>{b.income_bracket}</td>
                  <td style={{ textAlign: "right" }}>{b.start_persuadable_count}</td>
                  <td style={{ textAlign: "right" }}>{b.converted_count}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: rateColor(b.conversion_rate) }}>
                    {b.conversion_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
