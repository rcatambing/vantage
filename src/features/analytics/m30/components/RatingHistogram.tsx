import type { M30StaffBreakdown } from "../types";

const RED_40 = "#ff8389";
const YELLOW = "#f1c21b";
const BLUE_40 = "#78a9ff";
const GREEN = "#42be65";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";
const GRAY_80 = "#393939";

interface Props {
  data: M30StaffBreakdown[];
}

const W = 420;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 24;
const PAD_BOTTOM = 24;
const BAR_W = 28;

const BUCKETS = [
  { label: "1–4", min: 1, max: 4, color: RED_40, name: "Low" },
  { label: "5–6", min: 5, max: 6, color: YELLOW, name: "Medium" },
  { label: "7–8", min: 7, max: 8, color: BLUE_40, name: "Good" },
  { label: "9–10", min: 9, max: 10, color: GREEN, name: "Excellent" },
];

export default function RatingHistogram({ data }: Props) {
  const rated = data.filter((d) => d.avg_rating != null);
  const counts = BUCKETS.map((b) =>
    rated.filter((d) => d.avg_rating! >= b.min && d.avg_rating! <= b.max).length
  );
  const maxCount = Math.max(...counts, 1);

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = 140;
  const totalH = PAD_TOP + chartH + PAD_BOTTOM;
  const step = chartW / BUCKETS.length;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Average rating histogram">
      {/* Grid line */}
      <line x1={PAD_LEFT} y1={PAD_TOP + chartH} x2={PAD_LEFT + chartW} y2={PAD_TOP + chartH} stroke={GRAY_80} />

      {BUCKETS.map((b, i) => {
        const count = counts[i];
        const h = (count / maxCount) * chartH;
        const x = PAD_LEFT + i * step + (step - BAR_W) / 2;
        const y = PAD_TOP + chartH - h;

        return (
          <g key={b.label}>
            <rect x={x} y={y} width={BAR_W} height={h} fill={b.color} rx={2} />
            <text
              x={x + BAR_W / 2}
              y={PAD_TOP + chartH + 14}
              textAnchor="middle"
              fontSize={10}
              fill={GRAY_50}
            >
              {b.label}
            </text>
            <text
              x={x + BAR_W / 2}
              y={PAD_TOP + chartH + 26}
              textAnchor="middle"
              fontSize={9}
              fill={GRAY_70}
            >
              {b.name}
            </text>
            {count > 0 && (
              <text
                x={x + BAR_W / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={10}
                fill={GRAY_50}
              >
                {count}
              </text>
            )}
          </g>
        );
      })}

      {/* Y-axis label */}
      <text x={PAD_LEFT - 8} y={PAD_TOP - 4} textAnchor="end" fontSize={10} fill={GRAY_50}>
        Staff
      </text>
    </svg>
  );
}
