import type { M34StaffTypeEntry } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_70 = "#525252";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  data: M34StaffTypeEntry[];
}

const W = 420;
const PAD_LEFT = 140;
const PAD_RIGHT = 50;
const PAD_TOP = 8;
const BAR_H = 8;
const ROW_H = 28;

export default function RetentionStackedBar({ data }: Props) {
  if (!data.length) return null;

  const maxTotal = Math.max(...data.map((d) => d.total_count), 1);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + data.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Volunteer retention by staff type">
      {data.map((entry, i) => {
        const y = PAD_TOP + i * ROW_H;
        const activeW = Math.max(2, (entry.active_count / maxTotal) * chartW);
        const inactiveW = Math.max(2, ((entry.total_count - entry.active_count) / maxTotal) * chartW);
        const label = entry.staff_type.replace(/_/g, " ");
        const shortLabel = label.length > 18 ? label.slice(0, 16) + "…" : label;

        return (
          <g key={entry.staff_type}>
            {/* Track background */}
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            {/* Active segment */}
            <rect x={PAD_LEFT} y={y + 8} width={activeW} height={BAR_H} fill={BLUE_40} rx={2} />
            {/* Inactive segment */}
            <rect x={PAD_LEFT + activeW} y={y + 8} width={inactiveW} height={BAR_H} fill={GRAY_70} rx={2} />
            {/* Label */}
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {shortLabel}
            </text>
            {/* Count label */}
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={GRAY_50}>
              {entry.active_count}/{entry.total_count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
