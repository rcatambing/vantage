import { Spinner, NonIdealState, Button, Classes, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import { useM40 } from "./hooks/useM40";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function scoreBg(score: number): string {
  if (score >= 75) return GREEN_40;
  if (score >= 50) return YELLOW_30;
  return RED_40;
}

function FlagIcon({ value }: { value: boolean }) {
  return (
    <span style={{ fontSize: 14, color: value ? GREEN_40 : RED_40 }}>
      {value ? "✓" : "✗"}
    </span>
  );
}

export default function M40Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM40(campaignId);

  return (
    <Panel
      id="m40"
      name="M40 — District Readiness Score"
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
          Select a campaign to view district readiness score data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {data.readiness_breakdown.length > 0 ? (
            <div style={{ padding: "0 16px" }}>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ color: GRAY_50 }}>District</th>
                    <th style={{ color: GRAY_50 }}>Score</th>
                    <th style={{ color: GRAY_50 }}>Staff</th>
                    <th style={{ color: GRAY_50 }}>Intel</th>
                    <th style={{ color: GRAY_50 }}>Poll</th>
                    <th style={{ color: GRAY_50 }}>Leader</th>
                  </tr>
                </thead>
                <tbody>
                  {data.readiness_breakdown.map((entry) => (
                    <tr key={entry.district_id}>
                      <td>{entry.district_name}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 700,
                            backgroundColor: scoreBg(entry.score),
                            color: "#161616",
                          }}
                        >
                          {entry.score}
                        </span>
                      </td>
                      <td>
                        <FlagIcon value={entry.component_flags.has_staff} />
                      </td>
                      <td>
                        <FlagIcon value={entry.component_flags.has_intel} />
                      </td>
                      <td>
                        <FlagIcon value={entry.component_flags.has_poll} />
                      </td>
                      <td>
                        <FlagIcon value={entry.component_flags.has_leader} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No district readiness data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
