import type { M43DistrictBreakdown } from "../types";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";
const GRAY_80 = "#393939";

interface Props {
  districts: M43DistrictBreakdown[];
}

const W = 460;
const PAD_LEFT = 140;
const PAD_RIGHT = 70;
const PAD_TOP = 8;
const BAR_H = 8;
const ROW_H = 28;

function canvassColor(pct: number | null): string {
  if (pct == null) return GRAY_70;
  if (pct >= 80) return GREEN_40;
  if (pct >= 50) return YELLOW_30;
  return RED_40;
}

export default function CanvassProgressChart({ districts }: Props) {
  if (!districts.length) return null;

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + districts.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Canvass progress by district">
      {districts.map((d, i) => {
        const y = PAD_TOP + i * ROW_H;
        const pct = d.canvass_rate ?? 0;
        const barW = Math.max(2, (pct / 100) * chartW);
        const color = canvassColor(d.canvass_rate);
        const label = d.district_name.length > 18 ? d.district_name.slice(0, 16) + "…" : d.district_name;

        return (
          <g key={d.district_id}>
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={color} fontWeight={500}>
              {d.canvass_rate_display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
