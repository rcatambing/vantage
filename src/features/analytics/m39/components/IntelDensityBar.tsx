import type { M39DistrictEntry } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  data: M39DistrictEntry[];
}

const W = 420;
const PAD_LEFT = 140;
const PAD_RIGHT = 50;
const PAD_TOP = 8;
const BAR_H = 8;
const ROW_H = 28;

export default function IntelDensityBar({ data }: Props) {
  if (!data.length) return null;

  const maxDensity = Math.max(...data.map((d) => d.density), 0.001);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + data.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Regional intel density by district">
      {data.map((entry, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = Math.max(2, (entry.density / maxDensity) * chartW);
        const label = entry.district_name;
        const shortLabel = label.length > 18 ? label.slice(0, 16) + "…" : label;

        return (
          <g key={entry.district_id}>
            {/* Track background */}
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            {/* Density bar */}
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={BLUE_40} rx={2} />
            {/* Label */}
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {shortLabel}
            </text>
            {/* Density label */}
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={GRAY_50}>
              {entry.density.toFixed(2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
