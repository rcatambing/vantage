import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import UnfavorabilityGauge from "./components/UnfavorabilityGauge";
import { useM18 } from "./hooks/useM18";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M18Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM18(campaignId);

  return (
    <Panel
      id="m18"
      name="M18 — Unfavorability Rating"
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
          Select a campaign to view unfavorability data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "8px 0" }}>
          <UnfavorabilityGauge
            rate={data.unfavorability_rate}
            unfavorableCount={data.unfavorable_count}
            eligibleCount={data.eligible_count}
          />
        </div>
      )}
    </Panel>
  );
}
