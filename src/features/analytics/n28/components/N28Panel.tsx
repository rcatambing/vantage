import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN28 } from "../hooks/useN28";

const BLUE_60 = "#0f62fe";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N28Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN28(campaignId);

  return (
    <Panel
      id="n28"
      name="N28 — Signal Parameter Completeness"
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
                {data.completeness_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Parameter Completeness
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.total_signals} total signals</div>
              <div>{data.complete_signals} complete</div>
            </div>
          </div>

          {data.type_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY SIGNAL TYPE</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Signal Type</th>
                    <th style={{ textAlign: "right" }}>Required Params</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th style={{ textAlign: "right" }}>Complete</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.type_breakdown.map((t) => (
                    <tr key={t.signal_type_code}>
                      <td>{t.signal_type_name}</td>
                      <td style={{ textAlign: "right" }}>{t.required_param_count}</td>
                      <td style={{ textAlign: "right" }}>{t.total_signals}</td>
                      <td style={{ textAlign: "right" }}>{t.complete_signals}</td>
                      <td style={{ textAlign: "right", color: BLUE_60 }}>{t.completeness_rate}%</td>
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
