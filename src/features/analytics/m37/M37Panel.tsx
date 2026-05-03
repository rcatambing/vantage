import { Spinner, NonIdealState, Button, Classes, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import { useM37 } from "./hooks/useM37";

const BLUE_40 = "#78a9ff";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M37Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM37(campaignId);

  return (
    <Panel
      id="m37"
      name="M37 — Battleground District Identification"
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
          Select a campaign to view battleground district data.
        </div>
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
              gap: 24,
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: GRAY_50 }}>Candidate: </span>
              <span style={{ fontSize: 14, color: BLUE_40, fontWeight: 500 }}>{data.our_candidate}</span>
            </div>
            <div>
              <span style={{ fontSize: 12, color: GRAY_50 }}>Margin Threshold: </span>
              <span style={{ fontSize: 14, color: RED_40, fontWeight: 500 }}>{data.margin_threshold}%</span>
            </div>
          </div>

          {data.battlegrounds.length > 0 ? (
            <div style={{ padding: "0 16px" }}>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ color: GRAY_50 }}>District</th>
                    <th style={{ color: GRAY_50 }}>Our Support</th>
                    <th style={{ color: GRAY_50 }}>Opponent Support</th>
                    <th style={{ color: GRAY_50 }}>Margin</th>
                    <th style={{ color: GRAY_50 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.battlegrounds.map((entry) => {
                    const isBattleground = entry.margin <= data.margin_threshold;
                    return (
                      <tr key={entry.district_id}>
                        <td>{entry.district_name}</td>
                        <td>{entry.our_support.toFixed(1)}%</td>
                        <td>{entry.opponent_support.toFixed(1)}%</td>
                        <td style={{ color: isBattleground ? RED_40 : BLUE_40, fontWeight: 600 }}>
                          {entry.margin.toFixed(1)}%
                        </td>
                        <td>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              backgroundColor: isBattleground ? RED_40 : BLUE_40,
                              color: "#161616",
                            }}
                          >
                            {isBattleground ? "Battleground" : "Safe"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </HTMLTable>
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No battleground district data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
