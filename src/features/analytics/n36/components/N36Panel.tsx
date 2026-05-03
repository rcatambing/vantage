import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN36 } from "../hooks/useN36";

const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N36Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN36(campaignId);

  return (
    <Panel
      id="n36"
      name="N36 — Income Bracket Signal Intensity Gap"
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
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {data.district_breakdown.map((d) => (
            <div key={d.district_id} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderBottom: "1px solid #393939",
                }}
              >
                <div style={{ fontWeight: 600 }}>{d.district_name}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: d.intensity_gap > 20 ? RED_40 : GRAY_50 }}>
                  Gap: {d.intensity_gap}
                </div>
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Bracket</th>
                    <th style={{ textAlign: "right" }}>Avg Intensity</th>
                    <th style={{ textAlign: "right" }}>Voters</th>
                  </tr>
                </thead>
                <tbody>
                  {d.brackets.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center", color: GRAY_50 }}>No data</td>
                    </tr>
                  )}
                  {d.brackets.map((b) => (
                    <tr key={b.income_bracket}>
                      <td>{b.income_bracket}</td>
                      <td style={{ textAlign: "right" }}>{b.avg_intensity}</td>
                      <td style={{ textAlign: "right" }}>{b.voter_count}</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
