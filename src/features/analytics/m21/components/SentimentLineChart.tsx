/** SVG line chart for avg_sentiment over time (fixed y-range 1.0–5.0) */
import type { M21TrendBucket } from "../types";

const ML = 44;
const MT = 16;
const MR = 20;
const MB = 48;
const VW = 420;
const VH = 200;
const CW = VW - ML - MR; // 356
const CH = VH - MT - MB; // 136

const Y_MIN = 1;
const Y_MAX = 5;
const Y_RANGE = Y_MAX - Y_MIN; // 4
const Y_TICKS = [1, 2, 3, 4, 5];
const NEUTRAL_LINE = 3;

function toX(i: number, n: number): number {
  return ML + (n > 1 ? (i / (n - 1)) * CW : CW / 2);
}

function toY(val: number): number {
  return MT + CH - ((val - Y_MIN) / Y_RANGE) * CH;
}

function fmtBucketDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return iso.slice(5, 10);
  }
}

interface Props {
  trend: M21TrendBucket[];
}

export default function SentimentLineChart({ trend }: Props) {
  if (trend.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#888", padding: 24, fontSize: 12 }}>
        No trend data available
      </div>
    );
  }

  const n = trend.length;
  const step = Math.max(1, Math.ceil(n / 6));

  const points = trend.map((pt, i) => ({
    x: toX(i, n),
    y: toY(pt.avg_sentiment),
    val: pt.avg_sentiment,
    count: pt.response_count,
    label: fmtBucketDate(pt.bucket_start),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const neutralY = toY(NEUTRAL_LINE);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      role="img"
      aria-label="Sentiment trend over time"
    >
      {/* Y-axis ticks and grid lines */}
      {Y_TICKS.map((tick) => {
        const y = toY(tick);
        const isNeutral = tick === NEUTRAL_LINE;
        return (
          <g key={tick}>
            <line
              x1={ML}
              y1={y}
              x2={ML + CW}
              y2={y}
              stroke={isNeutral ? "#9e9e9e" : "#e8e8e8"}
              strokeWidth={isNeutral ? 1.5 : 1}
              strokeDasharray={isNeutral ? "4 3" : undefined}
            />
            <text
              x={ML - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="#888"
            >
              {tick.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Neutral reference annotation */}
      <text
        x={ML + CW + 2}
        y={neutralY}
        fontSize={9}
        fill="#9e9e9e"
        dominantBaseline="middle"
      >
        avg
      </text>

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="var(--cds-interactive, #0f62fe)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data point circles */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="var(--cds-interactive, #0f62fe)"
          stroke="#fff"
          strokeWidth={1.5}
        >
          <title>
            {p.label}: {p.val.toFixed(2)} avg ({p.count} responses)
          </title>
        </circle>
      ))}

      {/* X-axis date labels */}
      {points.map((p, i) => {
        if (i % step !== 0 && i !== n - 1) return null;
        return (
          <text
            key={i}
            x={p.x}
            y={MT + CH + 14}
            textAnchor="middle"
            fontSize={9}
            fill="#888"
          >
            {p.label}
          </text>
        );
      })}

      {/* Axes */}
      <line x1={ML} y1={MT} x2={ML} y2={MT + CH} stroke="#ccc" strokeWidth={1} />
      <line x1={ML} y1={MT + CH} x2={ML + CW} y2={MT + CH} stroke="#ccc" strokeWidth={1} />

      {/* Y-axis label */}
      <text
        x={10}
        y={MT + CH / 2}
        textAnchor="middle"
        fontSize={9}
        fill="#888"
        transform={`rotate(-90, 10, ${MT + CH / 2})`}
      >
        Sentiment
      </text>
    </svg>
  );
}
