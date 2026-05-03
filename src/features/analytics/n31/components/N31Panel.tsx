import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN31 } from "../hooks/useN31";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function scoreColor(score: number): string {
  if (score >= 60) return GREEN_40;
  if (score >= 40) return YELLOW_40;
  return RED_40;
}

export default function N31Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN31(campaignId);

  return (
    <Panel
      id="n31"
      name="N31 — District Winnability Composite"
      size="wide-large"
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
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1, color: scoreColor(data.winnability_score) }}>
                {data.winnability_score}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>Overall Winnability</div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              CWSS {data.components.cwss_weight} · PV {data.components.persuasion_velocity_weight} · LS {data.components.leader_support_weight} · WS {data.components.workforce_saturation_weight} · SLA {data.components.sla_risk_weight}
            </div>
          </div>

          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>District</th>
                <th style={{ textAlign: "right" }}>CWSS</th>
                <th style={{ textAlign: "right" }}>Persuasion</th>
                <th style={{ textAlign: "right" }}>Leader</th>
                <th style={{ textAlign: "right" }}>Workforce</th>
                <th style={{ textAlign: "right" }}>SLA Risk</th>
                <th style={{ textAlign: "right" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {data.district_breakdown.map((d) => (
                <tr key={d.district_id}>
                  <td>{d.district_name}</td>
                  <td style={{ textAlign: "right" }}>{d.cwss}</td>
                  <td style={{ textAlign: "right" }}>{d.persuasion_velocity}</td>
                  <td style={{ textAlign: "right" }}>{d.leader_support}</td>
                  <td style={{ textAlign: "right" }}>{d.workforce_saturation}</td>
                  <td style={{ textAlign: "right" }}>{d.sla_risk}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: scoreColor(d.winnability_score) }}>
                    {d.winnability_score}
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
