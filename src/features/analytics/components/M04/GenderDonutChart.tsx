import { Spinner, NonIdealState, Tooltip, Classes } from "@blueprintjs/core";
import type { MetricM04GenderRow } from "../../types";
import { GENDER_COLORS, GENDER_LABELS, fmt } from "./genderEncoding";

interface Props {
  data: MetricM04GenderRow[];
  loading?: boolean;
}

const SIZE = 220;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 100;
const INNER_RADIUS = 60;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutArcPath(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number): string {
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

export default function GenderDonutChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <NonIdealState
        icon="doughnut-chart"
        title="No data"
        description="No gender demographics match the current filters."
      />
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Build arc segments
  const segments: Array<{ gender: string; startAngle: number; endAngle: number; count: number; percentage: number }> = [];
  let currentAngle = 0;
  for (const d of data) {
    if (d.count === 0) continue;
    const sweep = (d.count / total) * 360;
    segments.push({
      gender: d.gender,
      startAngle: currentAngle,
      endAngle: currentAngle + sweep,
      count: d.count,
      percentage: d.percentage,
    });
    currentAngle += sweep;
  }

  const ariaDescription = segments
    .map((s) => `${GENDER_LABELS[s.gender] ?? s.gender}: ${fmt.format(s.count)} voters (${s.percentage.toFixed(1)}%)`)
    .join(". ");

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Gender Distribution
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ width: "100%", maxWidth: SIZE, height: "auto" }}
          role="img"
          aria-label={`Gender Distribution donut chart. ${ariaDescription}`}
        >
          {segments.map((seg) => {
            const color = GENDER_COLORS[seg.gender] ?? "var(--cds-interactive-01, #0f62fe)";
            // For a nearly-full circle, close off properly
            const adjustedEnd = seg.endAngle >= 359.99 ? 359.99 : seg.endAngle;
            return (
              <Tooltip
                key={seg.gender}
                content={`${GENDER_LABELS[seg.gender] ?? seg.gender}: ${fmt.format(seg.count)} (${seg.percentage.toFixed(1)}%)`}
                hoverOpenDelay={100}
                openOnTargetFocus={false}
              >
                <path
                  d={donutArcPath(CENTER, CENTER, OUTER_RADIUS, INNER_RADIUS, seg.startAngle, adjustedEnd)}
                  fill={color}
                  stroke="var(--cds-background, #fff)"
                  strokeWidth={2}
                  aria-hidden
                />
              </Tooltip>
            );
          })}

          {/* Center total label — aria-hidden because the parent SVG role="img" aria-label covers all data */}
          <text
            x={CENTER}
            y={CENTER - 6}
            textAnchor="middle"
            aria-hidden="true"
            style={{ fill: "var(--cds-text-primary)", fontSize: 18, fontWeight: 600 }}
          >
            {fmt.format(total)}
          </text>
          <text
            x={CENTER}
            y={CENTER + 12}
            textAnchor="middle"
            aria-hidden="true"
            style={{ fill: "var(--cds-text-secondary)", fontSize: 11 }}
          >
            Total
          </text>
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {segments.map((seg) => {
            const color = GENDER_COLORS[seg.gender] ?? "var(--cds-interactive-01, #0f62fe)";
            return (
              <div key={seg.gender} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, background: color, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14 }}>
                  {GENDER_LABELS[seg.gender] ?? seg.gender}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {seg.percentage.toFixed(1)}%
                </span>
                <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                  {fmt.format(seg.count)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
