import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useM53 } from "../hooks/useM53";

const RED_40 = "#ff8389";
const YELLOW_30 = "#f1c21b";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M53Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM53(campaignId);

  return (
    <Panel
      id="m53"
      name="M53 — Open Incident Rate"
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
          Select a campaign to view open incident data.
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
                  color: data.open_rate > 50 ? RED_40 : YELLOW_30,
                  lineHeight: 1,
                }}
              >
                {data.open_rate_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>open incident rate</div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.open_incidents} open</div>
              <div>{data.total_incidents} total</div>
            </div>
          </div>

          {data.severity_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY SEVERITY</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th style={{ textAlign: "right" }}>Open Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.severity_breakdown.map((s) => (
                    <tr key={s.severity}>
                      <td>{s.severity}</td>
                      <td style={{ textAlign: "right" }}>{s.open_count}</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          )}

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY DISTRICT</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Open Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td style={{ textAlign: "right" }}>{d.open_count}</td>
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
