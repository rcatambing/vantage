import type { M29StaffBreakdown } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  data: M29StaffBreakdown[];
}

const W = 420;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 24;
const PAD_BOTTOM = 24;
const BAR_W = 28;

const BUCKETS = [
  { label: "0–20%", min: 0, max: 20 },
  { label: "21–40%", min: 21, max: 40 },
  { label: "41–60%", min: 41, max: 60 },
  { label: "61–80%", min: 61, max: 80 },
  { label: "81–99%", min: 81, max: 99 },
  { label: "100%", min: 100, max: 100 },
];

export default function CompletionHistogram({ data }: Props) {
  const counts = BUCKETS.map((b) =>
    data.filter((d) => d.rate >= b.min && d.rate <= b.max).length
  );
  const maxCount = Math.max(...counts, 1);

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = 140;
  const totalH = PAD_TOP + chartH + PAD_BOTTOM;
  const step = chartW / BUCKETS.length;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Task completion rate histogram">
      {/* Grid line */}
      <line x1={PAD_LEFT} y1={PAD_TOP + chartH} x2={PAD_LEFT + chartW} y2={PAD_TOP + chartH} stroke={GRAY_80} />

      {BUCKETS.map((b, i) => {
        const count = counts[i];
        const h = (count / maxCount) * chartH;
        const x = PAD_LEFT + i * step + (step - BAR_W) / 2;
        const y = PAD_TOP + chartH - h;

        return (
          <g key={b.label}>
            <rect x={x} y={y} width={BAR_W} height={h} fill={BLUE_40} rx={2} />
            <text
              x={x + BAR_W / 2}
              y={PAD_TOP + chartH + 14}
              textAnchor="middle"
              fontSize={10}
              fill={GRAY_50}
            >
              {b.label}
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
