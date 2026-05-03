import { Spinner, NonIdealState, Button } from "@blueprintjs/core";
import Panel from "../../../components/Panel";
import EventAttendanceChart from "./components/EventAttendanceChart";
import { useM44 } from "./hooks/useM44";

const BLUE_60 = "#0f62fe";
const RED_60 = "#da1e28";

interface Props {
  campaignId: string;
  onRemove?: () => void;
}

export default function M44Panel({ campaignId, onRemove }: Props) {
  const { data, loading, error, refetch } = useM44(campaignId);

  return (
    <Panel
      id="m44"
      name="M44 — Rally / Event Attendance"
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
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Overall Fulfillment</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: data.overall_fulfillment_rate && data.overall_fulfillment_rate >= 80 ? BLUE_60 : RED_60 }}>{data.overall_display}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Events</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.event_count}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Actual Attendance</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_actual_attendance.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--cds-text-secondary)" }}>Expected Attendance</div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{data.total_expected_attendance.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <EventAttendanceChart events={data.event_breakdown} />
          </div>
        </div>
      )}
    </Panel>
  );
}
