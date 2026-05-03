import { Spinner, NonIdealState, Button, Classes, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import { useM38 } from "./hooks/useM38";

const BLUE_40 = "#78a9ff";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M38Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM38(campaignId);

  return (
    <Panel
      id="m38"
      name="M38 — Geographic Coverage Gap"
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
          Select a campaign to view geographic coverage gap data.
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
              <div style={{ fontSize: 32, fontWeight: 400, color: RED_40, lineHeight: 1 }}>
                {data.gap_count}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                gap districts
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.total_districts}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                total districts
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: GRAY_50, lineHeight: 1 }}>
                {data.gap_rate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                gap rate
              </div>
            </div>
          </div>

          {/* Gap table */}
          {data.gaps.length > 0 ? (
            <div style={{ padding: "0 16px" }}>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ color: GRAY_50 }}>District</th>
                    <th style={{ color: GRAY_50 }}>Type</th>
                    <th style={{ color: GRAY_50 }}>Province</th>
                    <th style={{ color: GRAY_50 }}>City</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gaps.map((entry) => (
                    <tr key={entry.district_id}>
                      <td>{entry.district_name}</td>
                      <td>{entry.district_type}</td>
                      <td>{entry.province}</td>
                      <td>{entry.city}</td>
                    </tr>
                  ))}
                </tbody>
              </HTMLTable>
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No coverage gaps found.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
