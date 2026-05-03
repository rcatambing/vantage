import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import ContactRateBarChart from "./components/ContactRateBarChart";
import { useM41 } from "./hooks/useM41";

const BLUE_70 = "#0043ce";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M41Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM41(campaignId);

  return (
    <Panel
      id="m41"
      name="M41 — Voter Contact Rate"
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
              height: 72,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              borderBottom: "1px solid #393939",
              gap: 32,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Overall Contact Rate</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: BLUE_70 }}>{data.overall_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Contacted</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_contacted_voters.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Target</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_target_voters.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <ContactRateBarChart districts={data.district_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
