import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import CostPerContactChart from "./components/CostPerContactChart";
import { useM50 } from "./hooks/useM50";

const BLUE_60 = "#0f62fe";
const RED_60 = "#da1e28";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M50Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM50(campaignId);

  return (
    <Panel
      id="m50"
      name="M50 — Cost per Voter Contact"
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Cost / Contact</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: data.overall_cost_per_contact && data.overall_cost_per_contact > 500 ? RED_60 : BLUE_60 }}>{data.overall_contact_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Cost / Voter</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.overall_voter_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Total Spend</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>₱{(data.total_outreach_spend / 100).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Contacts</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_contacts.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <CostPerContactChart channels={data.channel_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
