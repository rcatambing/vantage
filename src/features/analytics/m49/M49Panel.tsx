import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import BudgetUtilizationChart from "./components/BudgetUtilizationChart";
import { useM49 } from "./hooks/useM49";

const BLUE_60 = "#0f62fe";
const RED_60 = "#da1e28";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M49Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM49(campaignId);

  return (
    <Panel
      id="m49"
      name="M49 — Budget Utilization Rate"
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Overall Utilization</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: data.overall_utilization && data.overall_utilization >= 80 ? RED_60 : BLUE_60 }}>{data.overall_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Allocated</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>₱{(data.total_allocated / 100).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Spent</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>₱{(data.total_spent / 100).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Remaining</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>₱{(data.total_remaining / 100).toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <BudgetUtilizationChart categories={data.category_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
