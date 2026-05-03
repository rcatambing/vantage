import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN37 } from "../hooks/useN37";

const GREEN_40 = "#42be65";
const YELLOW_40 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

function disparityColor(d: number): string {
  if (Math.abs(d) < 10) return GREEN_40;
  if (Math.abs(d) < 25) return YELLOW_40;
  return RED_40;
}

export default function N37Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN37(campaignId);

  return (
    <Panel
      id="n37"
      name="N37 — Urban/Rural Support Disparity"
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
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1, color: disparityColor(data.disparity) }}>
                {data.disparity}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>Disparity (Urban − Rural)</div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 400 }}>{data.urban_avg}</div>
                <div style={{ fontSize: 11, color: GRAY_50 }}>Urban CWSS ({data.urban_count})</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 400 }}>{data.rural_avg}</div>
                <div style={{ fontSize: 11, color: GRAY_50 }}>Rural CWSS ({data.rural_count})</div>
              </div>
            </div>
          </div>

          <HTMLTable compact striped style={{ width: "100%", marginTop: 8 }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Classes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Urban</td>
                <td>{data.urban_classes.join(", ")}</td>
              </tr>
              <tr>
                <td>Rural</td>
                <td>{data.rural_classes.join(", ")}</td>
              </tr>
            </tbody>
          </HTMLTable>
        </div>
      )}
    </Panel>
  );
}
