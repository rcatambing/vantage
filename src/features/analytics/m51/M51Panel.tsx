import { Spinner, NonIdealState, Button, Classes, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import RatioBarChart from "./components/RatioBarChart";
import { useM51 } from "./hooks/useM51";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function ratioBadgeColor(ratio: number | null): string {
  if (ratio == null) return GRAY_50;
  const r = 1 / ratio;
  if (r <= 500) return GREEN_40;
  if (r <= 1000) return YELLOW_30;
  return RED_40;
}

export default function M51Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM51(campaignId);

  return (
    <Panel
      id="m51"
      name="M51 — Staff-to-Voter Ratio"
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
          Select a campaign to view staff-to-voter ratio data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          {/* KPI strip */}
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
              <div style={{ fontSize: 32, fontWeight: 400, color: GREEN_40, lineHeight: 1 }}>
                {data.overall_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                overall ratio
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_staff.toLocaleString()} staff</div>
              <div>{data.total_voters.toLocaleString()} voters</div>
            </div>
          </div>

          {/* Ratio bar chart */}
          {data.district_breakdown.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <RatioBarChart districts={data.district_breakdown} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No district ratio data available.
            </div>
          )}

          {/* Ratio table */}
          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Staff</th>
                    <th style={{ textAlign: "right" }}>Voters</th>
                    <th style={{ textAlign: "right" }}>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td>{d.district_type}</td>
                      <td style={{ textAlign: "right" }}>{d.staff_count}</td>
                      <td style={{ textAlign: "right" }}>{d.voter_count.toLocaleString()}</td>
                      <td style={{ textAlign: "right", color: ratioBadgeColor(d.ratio), fontWeight: 500 }}>
                        {d.ratio_display}
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
