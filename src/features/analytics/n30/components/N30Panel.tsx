import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN30 } from "../hooks/useN30";

const RED_40 = "#ff8389";
const BLUE_60 = "#0f62fe";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N30Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN30(campaignId);

  return (
    <Panel
      id="n30"
      name="N30 — Poll-Signal Divergence"
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
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 400,
                  color: data.summary.avg_divergence_index != null && data.summary.avg_divergence_index > 15 ? RED_40 : BLUE_60,
                  lineHeight: 1,
                }}
              >
                {data.summary.avg_divergence_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Avg Divergence
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.summary.districts_analyzed} districts analyzed</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY DISTRICT</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Poll Support</th>
                    <th style={{ textAlign: "right" }}>Signal Support</th>
                    <th style={{ textAlign: "right" }}>Divergence</th>
                    <th style={{ textAlign: "right" }}>Participants</th>
                    <th style={{ textAlign: "right" }}>Signals</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td style={{ textAlign: "right" }}>{d.poll_support_pct}%</td>
                      <td style={{ textAlign: "right" }}>{d.signal_support_pct}%</td>
                      <td
                        style={{
                          textAlign: "right",
                          color: d.divergence_index > 15 ? RED_40 : GRAY_50,
                        }}
                      >
                        {d.divergence_index}%
                      </td>
                      <td style={{ textAlign: "right" }}>{d.poll_participants}</td>
                      <td style={{ textAlign: "right" }}>{d.signal_count}</td>
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
