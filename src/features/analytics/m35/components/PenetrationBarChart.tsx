import type { M35DistrictBreakdown } from "../types";

const BLUE_10 = "#e5f6ff";
const BLUE_30 = "#82cfff";
const BLUE_50 = "#1192e8";
const BLUE_70 = "#0043ce";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";
const GRAY_80 = "#393939";

interface Props {
  districts: M35DistrictBreakdown[];
}

const W = 460;
const PAD_LEFT = 140;
const PAD_RIGHT = 70;
const PAD_TOP = 8;
const BAR_H = 8;
const ROW_H = 28;

function penetrationColor(pct: number | null): string {
  if (pct == null) return GRAY_70;
  if (pct >= 60) return BLUE_70;
  if (pct >= 40) return BLUE_50;
  if (pct >= 20) return BLUE_30;
  return BLUE_10;
}

export default function PenetrationBarChart({ districts }: Props) {
  if (!districts.length) return null;

  const maxVal = Math.max(...districts.map((d) => d.penetration_rate ?? 0), 0.001);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + districts.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Voter penetration by district">
      {districts.map((d, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = Math.max(2, ((d.penetration_rate ?? 0) / maxVal) * chartW);
        const color = penetrationColor(d.penetration_rate);
        const label = d.district_name.length > 18 ? d.district_name.slice(0, 16) + "…" : d.district_name;

        return (
          <g key={d.district_id}>
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={color} fontWeight={500}>
              {d.penetration_display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
