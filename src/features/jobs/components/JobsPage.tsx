import { Spinner, NonIdealState, Button, HTMLTable, Tag } from "@blueprintjs/core";
import { useJobs } from "../hooks/useJobs";

const GRAY_50 = "#8d8d8d";

function categoryColor(cat: string): string {
  if (cat === "METRICS") return "#0f62fe";
  if (cat === "SYSTEM") return "#42be65";
  if (cat === "DATA_MAINTENANCE") return "#f1c21b";
  return GRAY_50;
}

function statusColor(status: string): string {
  if (status === "ENABLED") return "#42be65";
  if (status === "DISABLED") return "#ff8389";
  return GRAY_50;
}

interface Props {
  category?: string;
}

export default function JobsPage({ category }: Props) {
  const { data, loading, error, refetch } = useJobs(category);

  const title = category ? `${category} Jobs` : "All Jobs";

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h1>
        <Button icon="refresh" minimal onClick={refetch} title="Refresh" />
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
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Scheduled</th>
              <th>Cron</th>
              <th>Class Path</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: GRAY_50 }}>No jobs found</td>
              </tr>
            )}
            {data?.items.map((j) => (
              <tr key={j.id}>
                <td><strong>{j.name}</strong></td>
                <td>
                  <Tag style={{ backgroundColor: categoryColor(j.category), color: "#fff" }} minimal>
                    {j.category}
                  </Tag>
                </td>
                <td>
                  <Tag style={{ backgroundColor: statusColor(j.status), color: "#fff" }} minimal>
                    {j.status}
                  </Tag>
                </td>
                <td>{j.is_scheduled ? "Yes" : "No"}</td>
                <td>{j.cron_expression ?? "—"}</td>
                <td style={{ fontSize: 11, color: GRAY_50 }}>{j.job_class_path}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
    </div>
  );
}
