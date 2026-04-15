import type { ReassignmentEntry } from "../types";

interface Props {
  entries: ReassignmentEntry[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function displayId(id: string | null): string {
  if (!id) return "Unassigned";
  return id.slice(0, 8) + "…";
}

export default function ReassignmentTimeline({ entries }: Props) {
  if (entries.length === 0) return null;

  // Newest first
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.reassigned_at).getTime() -
      new Date(a.reassigned_at).getTime(),
  );

  return (
    <section>
      <h4
        className="bp5-heading"
        style={{ fontSize: 14, marginBottom: 8 }}
      >
        Reassignment History
      </h4>
      <ul
        className="bp5-list bp5-list-unstyled"
        style={{ margin: 0, padding: 0 }}
      >
        {sorted.map((entry) => (
          <li
            key={entry.id}
            style={{
              padding: "6px 0",
              borderBottom: "1px solid var(--cds-border-subtle, #393939)",
              fontSize: 12,
            }}
          >
            <div style={{ color: "var(--cds-text-secondary, #c6c6c6)" }}>
              {formatDate(entry.reassigned_at)}
            </div>
            <div>
              {entry.from_user_id || entry.from_team_id ? (
                <>
                  From{" "}
                  <strong>
                    {displayId(entry.from_user_id ?? entry.from_team_id)}
                  </strong>
                </>
              ) : (
                "Initial assignment"
              )}{" "}
              → <strong>{displayId(entry.to_user_id ?? entry.to_team_id)}</strong>
            </div>
            <div style={{ color: "var(--cds-text-secondary, #c6c6c6)" }}>
              by {displayId(entry.reassigned_by)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
