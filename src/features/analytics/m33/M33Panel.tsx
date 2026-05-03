import { Spinner, NonIdealState, Button, Classes } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import DistrictUtilizationBar from "./components/DistrictUtilizationBar";
import { useM33 } from "./hooks/useM33";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M33Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM33(campaignId);

  return (
    <Panel
      id="m33"
      name="M33 — Area Assignment Utilization"
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
        <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
          Select a campaign to view area assignment utilization data.
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
              <div style={{ fontSize: 32, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.utilization_rate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: GRAY_50, marginTop: 4 }}>
                utilization rate
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: BLUE_40, lineHeight: 1 }}>
                {data.active_staff_count}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                active staff
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 400, color: GRAY_50, lineHeight: 1 }}>
                {data.total_assigned_count}
              </div>
              <div style={{ fontSize: 11, color: GRAY_50, marginTop: 2 }}>
                total assigned
              </div>
            </div>
          </div>

          {/* Horizontal bar chart */}
          {data.per_district.length > 0 ? (
            <div style={{ padding: "12px 8px 0" }}>
              <DistrictUtilizationBar data={data.per_district} />
            </div>
          ) : (
            <div className={Classes.TEXT_MUTED} style={{ padding: 16, textAlign: "center" }}>
              No district utilization data available.
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}
