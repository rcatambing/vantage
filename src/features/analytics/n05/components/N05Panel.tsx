import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN05 } from "../hooks/useN05";

const GREEN_40 = "#42be65";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function liftColor(lift: number | null): string {
  if (lift == null) return GRAY_50;
  if (lift > 0) return GREEN_40;
  if (lift < 0) return RED_40;
  return GRAY_50;
}

export default function N05Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN05(campaignId);

  return (
    <Panel
      id="n05"
      name="N05 — Affiliation Influence Lift"
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
        <div style={{ padding: 16, textAlign: "center", color: GRAY_50 }}>
          Select a campaign to view affiliation lift data.
        </div>
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
                  color: liftColor(data.overall_lift),
                  lineHeight: 1,
                }}
              >
                {data.lift_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Overall Lift
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.affiliation_count} affiliations</div>
            </div>
          </div>

          {data.affiliation_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>
                AFFILIATION BREAKDOWN
              </div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Affiliation</th>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Members</th>
                    <th style={{ textAlign: "right" }}>Member CWSS</th>
                    <th style={{ textAlign: "right" }}>Non-Member CWSS</th>
                    <th style={{ textAlign: "right" }}>Lift</th>
                  </tr>
                </thead>
                <tbody>
                  {data.affiliation_breakdown.map((a) => (
                    <tr key={a.affiliation_id}>
                      <td>{a.affiliation_name}</td>
                      <td>{a.affiliation_type}</td>
                      <td style={{ textAlign: "right" }}>{a.member_count}</td>
                      <td style={{ textAlign: "right" }}>{a.avg_member_cwss ?? "—"}</td>
                      <td style={{ textAlign: "right" }}>{a.avg_non_member_cwss ?? "—"}</td>
                      <td style={{ textAlign: "right", color: liftColor(a.lift) }}>
                        {a.lift_display}
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
