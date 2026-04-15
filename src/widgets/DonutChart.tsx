import { Classes } from "@blueprintjs/core";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  centerLabel?: string;
}

function computeArcs(segments: Segment[], total: number, circumference: number) {
  let cumulative = 0;
  return segments.map((seg) => {
    const pct = seg.value / total;
    const dashLength = pct * circumference;
    const dashOffset = -cumulative * circumference;
    cumulative += pct;
    return { key: seg.label, color: seg.color, dashLength, dashOffset };
  });
}

export default function DonutChart({ segments, centerLabel }: Props) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const arcs = computeArcs(segments, total, circumference);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, height: "100%", justifyContent: "center" }}>
      <div className="donut-chart">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {arcs.map((arc) => (
              <circle
                key={arc.key}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth="16"
                strokeDasharray={`${arc.dashLength} ${circumference - arc.dashLength}`}
                strokeDashoffset={arc.dashOffset}
              />
            ))}
        </svg>
        {centerLabel && <div className="donut-label">{centerLabel}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 0, background: seg.color, flexShrink: 0 }} />
            <span>{seg.label}</span>
            <span className={Classes.TEXT_MUTED} style={{ marginLeft: "auto" }}>
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
