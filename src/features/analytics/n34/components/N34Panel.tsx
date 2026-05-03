import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN34 } from "../hooks/useN34";

const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N34Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN34(campaignId);

  return (
    <Panel
      id="n34"
      name="N34 — Persuadable Density by City Class"
      size="medium"
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
              height: 48,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              CWSS Range: {data.cwss_min} – {data.cwss_max}
            </div>
          </div>

          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>City Class</th>
                <th style={{ textAlign: "right" }}>Persuadable</th>
                <th style={{ textAlign: "right" }}>Registered</th>
                <th style={{ textAlign: "right" }}>Density / 1K</th>
              </tr>
            </thead>
            <tbody>
              {data.city_class_breakdown.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: GRAY_50 }}>No data available</td>
                </tr>
              )}
              {data.city_class_breakdown.map((c) => (
                <tr key={c.city_class}>
                  <td>{c.city_class}</td>
                  <td style={{ textAlign: "right" }}>{c.persuadable_count}</td>
                  <td style={{ textAlign: "right" }}>{c.registered_count}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{c.density_per_1000}</td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
