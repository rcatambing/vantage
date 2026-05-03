import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN20 } from "../hooks/useN20";

const BLUE_60 = "#0f62fe";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N20Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN20(campaignId);

  return (
    <Panel
      id="n20"
      name="N20 — Religious Bloc Opportunity Score"
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
                {data.total_religions}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Religious Blocs
              </div>
            </div>
          </div>

          {data.bloc_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>OPPORTUNITY RANKING</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Religion</th>
                    <th style={{ textAlign: "right" }}>Members</th>
                    <th style={{ textAlign: "right" }}>Intensity</th>
                    <th style={{ textAlign: "right" }}>Confidence Gap</th>
                    <th style={{ textAlign: "right" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bloc_breakdown.map((b) => (
                    <tr key={b.affiliation_id}>
                      <td>#{b.opportunity_rank}</td>
                      <td>{b.religion_name}</td>
                      <td style={{ textAlign: "right" }}>{b.member_count}</td>
                      <td style={{ textAlign: "right" }}>{b.avg_intensity}</td>
                      <td style={{ textAlign: "right" }}>{b.confidence_gap}</td>
                      <td style={{ textAlign: "right", color: BLUE_60 }}>{b.opportunity_score}</td>
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
