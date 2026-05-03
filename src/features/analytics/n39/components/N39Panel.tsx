import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN39 } from "../hooks/useN39";

const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N39Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN39(campaignId);

  return (
    <Panel
      id="n39"
      name="N39 — Class-Weighted Winnability Modifier"
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
          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>City Class</th>
                <th style={{ textAlign: "right" }}>Turnout Factor</th>
                <th style={{ textAlign: "right" }}>Persuasion Factor</th>
                <th style={{ textAlign: "right" }}>Modifier</th>
                <th style={{ textAlign: "right" }}>Adj. Winnability</th>
              </tr>
            </thead>
            <tbody>
              {data.city_class_breakdown.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: GRAY_50 }}>No data available</td>
                </tr>
              )}
              {data.city_class_breakdown.map((c) => (
                <tr key={c.city_class}>
                  <td>{c.city_class}</td>
                  <td style={{ textAlign: "right" }}>{c.turnout_factor}</td>
                  <td style={{ textAlign: "right" }}>{c.persuasion_factor}</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{c.modifier}</td>
                  <td style={{ textAlign: "right" }}>{c.adjusted_winnability ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
