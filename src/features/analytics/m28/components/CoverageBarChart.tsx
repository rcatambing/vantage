import type { M28DistrictTypeBreakdown } from "../types";

const BLUE_40 = "#78a9ff";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  data: M28DistrictTypeBreakdown[];
}

const W = 420;
const PAD_LEFT = 140;
const PAD_RIGHT = 50;
const PAD_TOP = 8;
const BAR_H = 10;
const ROW_H = 28;

export default function CoverageBarChart({ data }: Props) {
  if (!data.length) return null;

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + data.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Coverage bars per district type">
      {data.map((entry, i) => {
        const y = PAD_TOP + i * ROW_H;
        const coveredW = Math.max(2, (entry.covered / entry.total) * chartW);
        const uncoveredW = Math.max(2, ((entry.total - entry.covered) / entry.total) * chartW);
        const label = entry.district_type.replace(/_/g, " ");
        const shortLabel = label.length > 18 ? label.slice(0, 16) + "…" : label;

        return (
          <g key={entry.district_type}>
            {/* Track background */}
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            {/* Covered segment */}
            <rect x={PAD_LEFT} y={y + 8} width={coveredW} height={BAR_H} fill={BLUE_40} rx={2} />
            {/* Uncovered segment */}
            <rect x={PAD_LEFT + coveredW} y={y + 8} width={uncoveredW} height={BAR_H} fill={RED_40} rx={2} />
            {/* Label */}
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {shortLabel}
            </text>
            {/* Count label */}
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={GRAY_50}>
              {entry.covered}/{entry.total}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
