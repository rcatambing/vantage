import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import PenetrationBarChart from "./components/PenetrationBarChart";
import { useM35 } from "./hooks/useM35";

const BLUE_70 = "#0043ce";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M35Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM35(campaignId);

  return (
    <Panel
      id="m35"
      name="M35 — District Voter Penetration"
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Overall Penetration</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: BLUE_70 }}>{data.overall_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Contacted Voters</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_contacted_voters.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Registered Voters</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_registered_voters.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <PenetrationBarChart districts={data.district_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
