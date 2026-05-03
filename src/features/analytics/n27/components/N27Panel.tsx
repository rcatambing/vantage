import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN27 } from "../hooks/useN27";

const BLUE_60 = "#0f62fe";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N27Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN27(campaignId);

  return (
    <Panel
      id="n27"
      name="N27 — District Intelligence Completeness"
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
              <div style={{ fontSize: 32, fontWeight: 400, color: BLUE_60, lineHeight: 1 }}>
                {data.average_completeness}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Avg Completeness Score
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.district_count} districts</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>DISTRICT SCORES</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Signal</th>
                    <th style={{ textAlign: "right" }}>Affiliation</th>
                    <th style={{ textAlign: "right" }}>Leader</th>
                    <th style={{ textAlign: "right" }}>Poll</th>
                    <th style={{ textAlign: "right" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td style={{ textAlign: "right" }}>{d.signal_coverage}</td>
                      <td style={{ textAlign: "right" }}>{d.affiliation_coverage}</td>
                      <td style={{ textAlign: "right" }}>{d.leader_presence}</td>
                      <td style={{ textAlign: "right" }}>{d.poll_participation}</td>
                      <td style={{ textAlign: "right", color: BLUE_60 }}>{d.completeness_score}</td>
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
