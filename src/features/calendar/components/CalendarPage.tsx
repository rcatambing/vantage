import { Spinner, NonIdealState, Button, HTMLTable, Tag, InputGroup, HTMLSelect } from "@blueprintjs/core";
import { useState } from "react";
import { useActivities } from "../hooks/useActivities";

const GRAY_50 = "#8d8d8d";

function statusColor(status: string): string {
  if (status === "COMPLETED") return "#42be65";
  if (status === "ONGOING") return "#0f62fe";
  if (status === "PLANNED") return "#f1c21b";
  if (status === "CANCELLED") return "#ff8389";
  return GRAY_50;
}

interface Props {
  campaignId?: string;
}

export default function CalendarPage({ campaignId }: Props) {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useActivities({
    campaign_id: campaignId,
    status: status || undefined,
    page_size: 50,
  });

  const filtered = data?.items.filter((a) =>
    search ? a.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Campaign Calendar</h1>
        <Button icon="refresh" minimal onClick={refetch} title="Refresh" />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <InputGroup
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <HTMLSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Planned", value: "PLANNED" },
            { label: "Ongoing", value: "ONGOING" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Cancelled", value: "CANCELLED" },
            { label: "Postponed", value: "POSTPONED" },
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
              <th>Type</th>
              <th>Status</th>
              <th>Scheduled</th>
              <th>Venue</th>
              <th style={{ textAlign: "right" }}>Expected</th>
              <th style={{ textAlign: "right" }}>Actual</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: GRAY_50 }}>No activities found</td>
              </tr>
            )}
            {filtered?.map((a) => (
              <tr key={a.activity_id}>
                <td><strong>{a.title}</strong></td>
                <td>{a.activity_type}</td>
                <td>
                  <Tag style={{ backgroundColor: statusColor(a.status), color: "#fff" }} minimal>
                    {a.status}
                  </Tag>
                </td>
                <td>{new Date(a.scheduled_at).toLocaleString()}</td>
                <td>{a.venue ?? "—"}</td>
                <td style={{ textAlign: "right" }}>{a.expected_attendance}</td>
                <td style={{ textAlign: "right" }}>{a.actual_attendance}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
    </div>
  );
}
