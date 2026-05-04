import { Spinner, NonIdealState, Button, HTMLTable, Tag, HTMLSelect } from "@blueprintjs/core";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";

const GRAY_50 = "#8d8d8d";

function statusColor(status: string): string {
  if (status === "SENT") return "#42be65";
  if (status === "SCHEDULED") return "#f1c21b";
  if (status === "FAILED") return "#ff8389";
  if (status === "DRAFT") return "#8d8d8d";
  return GRAY_50;
}

export default function NotificationsPage() {
  const [status, setStatus] = useState("");
  const { data, loading, error, refetch } = useNotifications({ status: status || undefined, page_size: 50 });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Notifications</h1>
        <Button icon="refresh" minimal onClick={refetch} title="Refresh" />
      </div>

      <div style={{ marginBottom: 16 }}>
        <HTMLSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Draft", value: "DRAFT" },
            { label: "Scheduled", value: "SCHEDULED" },
            { label: "Sent", value: "SENT" },
            { label: "Failed", value: "FAILED" },
            { label: "Cancelled", value: "CANCELLED" },
          ]}
        />
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
          <Spinner size={24} />
        </div>
      )}
      {!loading && error && (
        <NonIdealState icon="error" title="Failed to load" description={error} />
      )}
      {!loading && !error && (
        <HTMLTable compact striped style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Scheduled</th>
              <th>Sent</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: GRAY_50 }}>No notifications found</td>
              </tr>
            )}
            {data?.items.map((n) => (
              <tr key={n.notification_id}>
                <td><strong>{n.title}</strong></td>
                <td>{n.channel}</td>
                <td>
                  <Tag style={{ backgroundColor: statusColor(n.status), color: "#fff" }} minimal>
                    {n.status}
                  </Tag>
                </td>
                <td>{n.scheduled_at ? new Date(n.scheduled_at).toLocaleString() : "—"}</td>
                <td>{n.sent_at ? new Date(n.sent_at).toLocaleString() : "—"}</td>
                <td>{n.target_audience ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
    </div>
  );
}
