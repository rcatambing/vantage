import {
  Spinner,
  NonIdealState,
  Card,
  Classes,
} from "@blueprintjs/core";
import type { PollResponseAggregate } from "../types";

interface Props {
  aggregates: PollResponseAggregate[];
  loading: boolean;
}

function BarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {entries.map(([label, value]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 100, fontSize: 12, textAlign: "right" }}>{label}</div>
          <div
            style={{
              flex: 1,
              height: 20,
              background: "var(--cds-border-subtle, #393939)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(value / max) * 100}%`,
                height: "100%",
                background: "var(--cds-button-primary, #0f62fe)",
                transition: "width 200ms ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
              }}
            >
              <span style={{ fontSize: 11, color: "#fff" }}>{value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const colors = ["#0f62fe", "#24a148", "#f1c21b", "#da1e28", "#8a3ffc"];

  let cumulative = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width={120} height={120} viewBox="0 0 120 120">
        {entries.map(([label, value], idx) => {
          const startAngle = (cumulative / total) * 360;
          const sweep = (value / total) * 360;
          cumulative += value;
          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((startAngle + sweep - 90) * Math.PI) / 180;
          const x1 = 60 + 50 * Math.cos(startRad);
          const y1 = 60 + 50 * Math.sin(startRad);
          const x2 = 60 + 50 * Math.cos(endRad);
          const y2 = 60 + 50 * Math.sin(endRad);
          const largeArc = sweep > 180 ? 1 : 0;
          return (
            <path
              key={label}
              d={`M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[idx % colors.length]}
              stroke="var(--cds-background, #161616)"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map(([label, value], idx) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                background: colors[idx % colors.length],
              }}
            />
            <span style={{ fontSize: 12 }}>
              {label}: {value} ({total > 0 ? Math.round((value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PollResponseDashboard({ aggregates, loading }: Props) {
  const hasData = aggregates.length > 0;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spinner size={20} />
      </div>
    );
  }

  if (!hasData) {
    return (
      <NonIdealState
        icon="chart"
        title="No responses yet"
        description="Responses will appear here once participants start answering."
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {aggregates.map((agg) => (
        <Card
          key={agg.question_id}
          style={{
            padding: 20,
            background: "var(--cds-layer-01, #262626)",
          }}
        >
          <h4 className="bp5-heading" style={{ fontSize: 14, marginBottom: 4 }}>
            {agg.question_text}
          </h4>
          <div
            className={Classes.TEXT_MUTED}
            style={{ fontSize: 12, marginBottom: 16 }}
          >
            {agg.total_responses} responses ·{" "}
            {agg.question_type}
          </div>

          {agg.question_type === "BOOLEAN" ? (
            <PieChart data={agg.breakdown} />
          ) : (
            <BarChart data={agg.breakdown} />
          )}
        </Card>
      ))}
    </div>
  );
}
