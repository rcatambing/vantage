import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN15 } from "../hooks/useN15";

const BLUE_60 = "#0f62fe";
const CYAN_60 = "#0072c3";
const GRAY_50 = "#8d8d8d";
const ORANGE_60 = "#ba4e00";
const RED_60 = "#da1e28";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function stageColor(stage: string): string {
  switch (stage) {
    case "STRONG_SUPPORTER": return BLUE_60;
    case "LEAN_SUPPORTER": return CYAN_60;
    case "PERSUADABLE": return GRAY_50;
    case "LEAN_OPPONENT": return ORANGE_60;
    case "STRONG_OPPONENT": return RED_60;
    default: return GRAY_50;
  }
}

export default function N15Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN15(campaignId);

  return (
    <Panel
      id="n15"
      name="N15 — Persuasion Funnel Stage Distribution"
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
                {data.total_voters}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Total Voters
              </div>
            </div>
          </div>

          {data.stage_distribution.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>STAGE DISTRIBUTION</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th style={{ textAlign: "right" }}>Count</th>
                    <th style={{ textAlign: "right" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stage_distribution.map((s) => (
                    <tr key={s.stage}>
                      <td style={{ color: stageColor(s.stage) }}>{s.stage.replace(/_/g, " ")}</td>
                      <td style={{ textAlign: "right" }}>{s.count}</td>
                      <td style={{ textAlign: "right" }}>{s.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>DISTRICT BREAKDOWN</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th>Dominant Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.slice(0, 10).map((d) => (
                    <tr key={d.district_id}>
                      <td>District {d.district_id}</td>
                      <td style={{ textAlign: "right" }}>{d.total_voters}</td>
                      <td style={{ color: stageColor(d.dominant_stage) }}>
                        {d.dominant_stage.replace(/_/g, " ")}
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
