import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN29 } from "../hooks/useN29";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function overrideColor(rate: number): string {
  if (rate >= 15 && rate <= 30) return GREEN_40;
  if (rate > 30) return RED_40;
  return YELLOW_40;
}

export default function N29Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN29(campaignId);

  return (
    <Panel
      id="n29"
      name="N29 — Derived Signal Override Rate"
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
                  color: overrideColor(data.override_rate),
                  lineHeight: 1,
                }}
              >
                {data.override_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Override Rate
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_derived_signals} derived signals</div>
              <div>{data.override_count} overrides</div>
              <div>Threshold: ±{data.override_threshold}</div>
            </div>
          </div>

          {data.affiliation_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>TOP AFFILIATIONS BY OVERRIDE</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Affiliation ID</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Overrides</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                    <th style={{ textAlign: "right" }}>Avg Deviation</th>
                  </tr>
                </thead>
                <tbody>
                  {data.affiliation_breakdown.map((a) => (
                    <tr key={a.affiliation_id}>
                      <td>{a.affiliation_id}</td>
                      <td style={{ textAlign: "right" }}>{a.total_derived}</td>
                      <td style={{ textAlign: "right" }}>{a.override_count}</td>
                      <td style={{ textAlign: "right", color: overrideColor(a.override_rate) }}>
                        {a.override_rate}%
                      </td>
                      <td style={{ textAlign: "right" }}>{a.avg_deviation}</td>
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
