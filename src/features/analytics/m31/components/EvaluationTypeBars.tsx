import type { M31EvaluationType } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  data: M31EvaluationType[];
}

const W = 420;
const PAD_LEFT = 160;
const PAD_RIGHT = 50;
const PAD_TOP = 8;
const BAR_H = 10;
const ROW_H = 28;

export default function EvaluationTypeBars({ data }: Props) {
  if (!data.length) return null;

  const maxAvg = Math.max(...data.map((d) => d.avg ?? 0), 10);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + data.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Evaluation type average scores">
      {data.map((entry, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = Math.max(2, ((entry.avg ?? 0) / maxAvg) * chartW);
        const label = entry.evaluation_type.replace(/_/g, " ");
        const shortLabel = label.length > 20 ? label.slice(0, 18) + "…" : label;

        return (
          <g key={entry.evaluation_type}>
            {/* Track background */}
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            {/* Value bar */}
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={BLUE_40} rx={2} />
            {/* Label */}
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {shortLabel}
            </text>
            {/* Score label */}
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={GRAY_50}>
              {entry.avg != null ? entry.avg.toFixed(1) : "—"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
