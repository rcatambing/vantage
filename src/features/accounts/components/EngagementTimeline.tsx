import { Icon, Intent } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";
import type { LeaderEngagementEvent, EngagementEventType } from "../types";

const EVENT_ICON: Record<EngagementEventType, IconName> = {
  MEETING: "people",
  COMMITMENT: "tick",
  ISSUE: "warning-sign",
  NOTE: "annotation",
};

const EVENT_LABEL: Record<EngagementEventType, string> = {
  MEETING: "Meeting",
  COMMITMENT: "Commitment",
  ISSUE: "Issue",
  NOTE: "Note",
};

const EVENT_INTENT: Record<EngagementEventType, Intent> = {
  MEETING: Intent.PRIMARY,
  COMMITMENT: Intent.SUCCESS,
  ISSUE: Intent.WARNING,
  NOTE: Intent.NONE,
};

function formatDate(iso: string): string {
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

/** Group engagement events into { dateLabel: events[] } map ordered newest-first */
function groupByDate(events: LeaderEngagementEvent[]): Map<string, LeaderEngagementEvent[]> {
  const sorted = [...events].sort(
    (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  );
  const map = new Map<string, LeaderEngagementEvent[]>();
  for (const ev of sorted) {
    const label = formatDate(ev.occurred_at);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(ev);
  }
  return map;
}

interface Props {
  events: LeaderEngagementEvent[];
}

export function EngagementTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <p style={{ color: "var(--cds-text-secondary, #525252)", fontSize: 13 }}>
        No engagement events recorded yet.
      </p>
    );
  }

  const grouped = groupByDate(events);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {Array.from(grouped.entries()).map(([dateLabel, dayEvents]) => (
        <div key={dateLabel}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--cds-text-secondary, #525252)",
              borderBottom: "1px solid var(--cds-border-subtle, #c6c6c6)",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            {dateLabel}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  gap: 10,
                  paddingLeft: 4,
                  borderLeft: `3px solid ${intentColor(EVENT_INTENT[ev.event_type])}`,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <Icon
                  icon={EVENT_ICON[ev.event_type]}
                  intent={EVENT_INTENT[ev.event_type]}
                  size={14}
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {EVENT_LABEL[ev.event_type]}
                  </div>
                  <p style={{ margin: "2px 0 4px", fontSize: 13 }}>
                    {ev.description}
                  </p>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--cds-text-secondary, #525252)",
                      letterSpacing: "0.32px",
                    }}
                  >
                    Recorded by {ev.recorded_by_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function intentColor(intent: Intent): string {
  switch (intent) {
    case Intent.SUCCESS:
      return "#24a148";
    case Intent.WARNING:
      return "#f1c21b";
    case Intent.DANGER:
      return "#da1e28";
    case Intent.PRIMARY:
      return "#0f62fe";
    default:
      return "#c6c6c6";
  }
}
