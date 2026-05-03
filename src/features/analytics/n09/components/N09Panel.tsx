import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN09 } from "../hooks/useN09";

const GREEN_40 = "#42be65";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N09Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN09(campaignId);

  return (
    <Panel
      id="n09"
      name="N09 — Leader Support Conversion"
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
          Select a campaign to view conversion data.
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
              <div style={{ fontSize: 32, fontWeight: 400, color: GREEN_40, lineHeight: 1 }}>
                {data.conversion_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Conversion Rate ({data.days_lookback}d)
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.converted_count} converted</div>
              <div>{data.total_engaged} engaged</div>
            </div>
          </div>

          {data.level_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY INFLUENCE LEVEL</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th style={{ textAlign: "right" }}>Engaged</th>
                    <th style={{ textAlign: "right" }}>Converted</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.level_breakdown.map((l) => (
                    <tr key={l.influence_level}>
                      <td>{l.influence_level}</td>
                      <td style={{ textAlign: "right" }}>{l.engaged}</td>
                      <td style={{ textAlign: "right" }}>{l.converted}</td>
                      <td style={{ textAlign: "right", color: GREEN_40 }}>{l.conversion_display}</td>
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
