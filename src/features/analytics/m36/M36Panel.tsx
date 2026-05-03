import { Spinner, NonIdealState, Button, Classes, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import SupportIndexBar from "./components/SupportIndexBar";
import { useM36 } from "./hooks/useM36";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M36Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM36(campaignId);

  return (
    <Panel
      id="m36"
      name="M36 — Barangay Support Index"
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
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view barangay support index data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* Ranked table */}
          {data.barangay_scores.length > 0 ? (
            <div style={{ padding: "0 16px" }}>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ color: GRAY_50 }}>Rank</th>
                    <th style={{ color: GRAY_50 }}>District</th>
                    <th style={{ color: GRAY_50 }}>Support Index</th>
                    <th style={{ color: GRAY_50 }}>Poll Favorability</th>
                    <th style={{ color: GRAY_50 }}>Voter Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.barangay_scores
                    .sort((a, b) => b.support_index - a.support_index)
                    .map((entry, idx) => (
                      <tr key={entry.district_id}>
                        <td style={{ color: BLUE_40, fontWeight: 600 }}>{idx + 1}</td>
                        <td>{entry.district_name}</td>
                        <td style={{ color: BLUE_40, fontWeight: 600 }}>{entry.support_index.toFixed(1)}</td>
                        <td>{entry.poll_favorability.toFixed(1)}%</td>
                        <td>{entry.voter_count.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </HTMLTable>

              <div style={{ padding: "12px 0 0" }}>
                <SupportIndexBar data={data.barangay_scores.sort((a, b) => b.support_index - a.support_index)} />
              </div>
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No barangay support data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
