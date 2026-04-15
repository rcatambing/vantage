import { HTMLTable, NonIdealState, Spinner, Callout, Intent, Tag } from "@blueprintjs/core";
import { useResourceHistory } from "../hooks/useResourceHistory";

interface Props {
  resourceId: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ResourceAssignmentHistory({ resourceId }: Props) {
  const { history, loading, error } = useResourceHistory(resourceId);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} icon="error">
        {error}
      </Callout>
    );
  }

  if (history.length === 0) {
    return (
      <NonIdealState
        icon="history"
        title="No assignment history"
        description="This resource has not been assigned to any office yet."
      />
    );
  }

  return (
    <HTMLTable striped bordered style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          <th>Office</th>
          <th>From Office</th>
          <th>Assigned</th>
          <th>Unassigned</th>
          <th>Assigned By</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {history.map((record) => {
          const isCurrent = record.unassigned_at == null;
          return (
            <tr
              key={record.id}
              style={
                isCurrent
                  ? { background: "var(--cds-highlight, rgba(45, 114, 210, 0.1))" }
                  : undefined
              }
            >
              <td>
                <span style={{ fontWeight: isCurrent ? 600 : undefined }}>
                  {record.office_name}
                </span>
                {isCurrent && (
                  <Tag minimal intent={Intent.PRIMARY} style={{ marginLeft: 6, fontSize: 10 }}>
                    Current
                  </Tag>
                )}
              </td>
              <td>{record.from_office_name ?? "—"}</td>
              <td>{formatDate(record.assigned_at)}</td>
              <td>{formatDate(record.unassigned_at)}</td>
              <td>{record.assigned_by_name ?? record.assigned_by ?? "—"}</td>
              <td style={{ color: "var(--cds-text-secondary, #525252)" }}>
                {record.notes ?? "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </HTMLTable>
  );
}
