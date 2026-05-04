import { Tag, Intent } from "@blueprintjs/core";

interface Props {
  slaDueAt: string | null;
  slaBreached: boolean;
  createdAt: string;
  resolvedAt: string | null;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function SLATimeline({
  slaDueAt,
  slaBreached,
  createdAt,
  resolvedAt,
}: Props) {
  if (!slaDueAt) return null;

  const created = new Date(createdAt).getTime();
  const due = new Date(slaDueAt).getTime();
  const resolved = resolvedAt ? new Date(resolvedAt).getTime() : null;
  const now = Date.now();

  const totalDuration = due - created;
  const elapsed = resolved ? resolved - created : now - created;
  const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const isBreached = slaBreached || now > due;

  return (
    <div style={{ marginTop: 16 }}>
      <h4
        className="bp5-heading"
        style={{ fontSize: 14, marginBottom: 12 }}
      >
        SLA Timeline
      </h4>

      {/* Timeline track */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        {/* Background track */}
        <div
          style={{
            height: 6,
            background: "var(--cds-border-subtle, #393939)",
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              background: isBreached
                ? "var(--bp5-intent-danger, #da1e28)"
                : "var(--bp5-intent-primary, #0f62fe)",
              transition: "width 200ms ease, background 300ms ease",
            }}
          />
        </div>

        {/* Milestone markers */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
            fontSize: 11,
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "var(--cds-text-secondary, #c6c6c6)" }}>Created</div>
            <div>{formatDateTime(createdAt)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--cds-text-secondary, #c6c6c6)" }}>SLA Due</div>
            <div style={{ fontWeight: 600 }}>{formatDateTime(slaDueAt)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--cds-text-secondary, #c6c6c6)" }}>
              {resolvedAt ? "Resolved" : "Status"}
            </div>
            <div>
              {resolvedAt ? (
                formatDateTime(resolvedAt)
              ) : isBreached ? (
                <Tag intent={Intent.DANGER} minimal>
                  Breached
                </Tag>
              ) : (
                <Tag intent={Intent.SUCCESS} minimal>
                  On Track
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breach warning */}
      {isBreached && !resolvedAt && (
        <div
          style={{
            padding: "8px 12px",
            background: "rgba(218, 30, 40, 0.15)",
            borderLeft: "3px solid var(--bp5-intent-danger, #da1e28)",
            fontSize: 12,
            color: "var(--bp5-intent-danger, #da1e28)",
          }}
          role="alert"
          aria-live="assertive"
        >
          SLA has been breached. Immediate attention required.
        </div>
      )}
    </div>
  );
}
