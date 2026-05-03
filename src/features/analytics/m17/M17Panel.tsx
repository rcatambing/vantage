import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import FavorabilityGauge from "./components/FavorabilityGauge";
import { useM17 } from "./hooks/useM17";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M17Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM17(campaignId);

  return (
    <Panel
      id="m17"
      name="M17 — Favorability Rating"
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
        <NonIdealState
          icon="error"
          title="Failed to load"
          description={error}
        />
      )}
      {!loading && !error && !campaignId && (
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view favorability data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          <FavorabilityGauge
            rate={data.favorability_rate}
            favorableCount={data.favorable_count}
            eligibleCount={data.eligible_count}
          />
        </div>
      )}
    </Panel>
  );
}
