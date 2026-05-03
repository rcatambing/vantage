import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN33 } from "../hooks/useN33";

const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N33Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN33(campaignId);

  return (
    <Panel
      id="n33"
      name="N33 — Support Variance by City Class"
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
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1 }}>
                {data.overall_variance ?? "—"}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>Overall Variance</div>
            </div>
          </div>

          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>City Class</th>
                <th style={{ textAlign: "right" }}>Avg CWSS</th>
                <th style={{ textAlign: "right" }}>Voters</th>
              </tr>
            </thead>
            <tbody>
              {data.city_class_breakdown.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: GRAY_50 }}>No data available</td>
                </tr>
              )}
              {data.city_class_breakdown.map((c) => (
                <tr key={c.city_class}>
                  <td>{c.city_class}</td>
                  <td style={{ textAlign: "right" }}>{c.avg_cwss}</td>
                  <td style={{ textAlign: "right" }}>{c.voter_count}</td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
