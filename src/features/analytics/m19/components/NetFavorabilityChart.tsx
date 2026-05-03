/** SVG line chart showing net_favorability over poll trend */
import type { M19TrendPoint } from "../types";

const ML = 44;
const MT = 20;
const MR = 20;
const MB = 48;
const VW = 420;
const VH = 200;
const CW = VW - ML - MR; // 356
const CH = VH - MT - MB; // 132

const Y_MIN = -100;
const Y_MAX = 100;
const Y_RANGE = Y_MAX - Y_MIN; // 200

function toX(i: number, n: number): number {
  return ML + (n > 1 ? (i / (n - 1)) * CW : CW / 2);
}

function toY(val: number | null): number {
  const v = val ?? 0;
  return MT + CH - ((v - Y_MIN) / Y_RANGE) * CH;
}

const Y_TICKS = [-100, -50, 0, 50, 100];

interface Props {
  trend: M19TrendPoint[];
}

export default function NetFavorabilityChart({ trend }: Props) {
  if (trend.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#888", padding: 24, fontSize: 12 }}>
        No trend data available
      </div>
    );
  }

  const n = trend.length;
  // Every Nth label to avoid crowding (max 6 labels)
  const step = Math.max(1, Math.ceil(n / 6));

  const points = trend.map((pt, i) => ({
    x: toX(i, n),
    y: toY(pt.net_favorability),
    val: pt.net_favorability,
    label: pt.poll_name,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      role="img"
      aria-label="Net favorability trend line chart"
    >
      {/* Y-axis grid lines and tick labels */}
      {Y_TICKS.map((tick) => {
        const y = toY(tick);
        const isZero = tick === 0;
        return (
          <g key={tick}>
            <line
              x1={ML}
              y1={y}
              x2={ML + CW}
              y2={y}
              stroke={isZero ? "#9e9e9e" : "#e8e8e8"}
              strokeWidth={isZero ? 1.5 : 1}
              strokeDasharray={isZero ? "4 3" : undefined}
            />
            <text
              x={ML - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="#888"
            >
              {tick > 0 ? `+${tick}` : tick}
            </text>
          </g>
        );
      })}

      {/* Zero label */}
      <text x={ML - 6} y={toY(0)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#555">
        0
      </text>

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="var(--cds-interactive, #0f62fe)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={
            p.val == null
              ? "#ccc"
              : p.val > 0
              ? "#4CAF50"
              : p.val < 0
              ? "#E53935"
              : "#888"
          }
          stroke="#fff"
          strokeWidth={1.5}
        >
          <title>
            {p.label}: {p.val != null ? `${p.val > 0 ? "+" : ""}${p.val.toFixed(1)}%` : "N/A"}
          </title>
        </circle>
      ))}

      {/* X-axis labels */}
      {points.map((p, i) => {
        if (i % step !== 0 && i !== n - 1) return null;
        const label = p.label.length > 12 ? p.label.slice(0, 11) + "…" : p.label;
        return (
          <text
            key={i}
            x={p.x}
            y={MT + CH + 14}
            textAnchor="middle"
            fontSize={9}
            fill="#888"
          >
            {label}
          </text>
        );
      })}

      {/* Axes */}
      <line x1={ML} y1={MT} x2={ML} y2={MT + CH} stroke="#ccc" strokeWidth={1} />
      <line x1={ML} y1={MT + CH} x2={ML + CW} y2={MT + CH} stroke="#ccc" strokeWidth={1} />
    </svg>
  );
}
