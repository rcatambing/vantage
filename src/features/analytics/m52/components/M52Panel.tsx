import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../../components/Panel";
import { useM52 } from "../hooks/useM52";

const GREEN_40 = "#42be65";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M52Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM52(campaignId);

  return (
    <Panel
      id="m52"
      name="M52 — Device Deployment Rate"
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
      {!loading && !error && !campaignId && (
        <div style={{ padding: 16, textAlign: "center", color: GRAY_50 }}>
          Select a campaign to view device deployment data.
        </div>
      )}
      {!loading && !error && data && (
        <div style={{ padding: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 400, color: GREEN_40, lineHeight: 1 }}>
              {data.deployment_rate.toFixed(1)}%
            </div>
            <div style={{ fontSize: 12, color: GRAY_50, marginTop: 8 }}>
              Device Deployment Rate
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#f4f4f4" }}>
                {data.active_devices}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50 }}>Active Devices</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#f4f4f4" }}>
                {data.active_staff}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50 }}>Active Staff</div>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
