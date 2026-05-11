import { Spinner, NonIdealState, Button, HTMLTable } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useN23 } from "../hooks/useN23";

const BLUE_60 = "#0f62fe";
const GREEN_50 = "#24a148";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function N23Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useN23(campaignId);

  return (
    <Panel
      id="n23"
      name="N23 — Fieldwork Signal Conversion Rate"
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
                  color: data.summary.conversion_rate != null && data.summary.conversion_rate > 30 ? GREEN_50 : BLUE_60,
                  lineHeight: 1,
                }}
              >
                {data.summary.conversion_rate_display}
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                Conversion Rate
              </div>
            </div>
            <div style={{ fontSize: 11, color: GRAY_50 }}>
              <div>{data.summary.total_contacts} total contacts</div>
              <div>{data.summary.converted_contacts} converted</div>
            </div>
          </div>

          {data.district_breakdown.length > 0 && (
            <div style={{ padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: GRAY_50, marginBottom: 8 }}>BY DISTRICT</div>
              <HTMLTable compact striped style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>District</th>
                    <th style={{ textAlign: "right" }}>Total Contacts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.district_breakdown.map((d) => (
                    <tr key={d.district_id}>
                      <td>{d.district_name}</td>
                      <td style={{ textAlign: "right" }}>{d.total_contacts}</td>
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
