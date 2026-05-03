import type { M42DistrictBreakdown } from "../types";

const BLUE_30 = "#82cfff";
const BLUE_50 = "#1192e8";
const BLUE_70 = "#0043ce";
const RED_60 = "#da1e28";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";
const GRAY_80 = "#393939";

interface Props {
  districts: M42DistrictBreakdown[];
}

const W = 460;
const PAD_LEFT = 140;
const PAD_RIGHT = 70;
const PAD_TOP = 8;
const BAR_H = 8;
const ROW_H = 28;
const THRESHOLD = 3.0;

function touchpointColor(val: number | null): string {
  if (val == null) return GRAY_70;
  if (val >= THRESHOLD) return BLUE_70;
  if (val >= 2) return BLUE_50;
  return BLUE_30;
}

export default function TouchpointBarChart({ districts }: Props) {
  if (!districts.length) return null;

  const maxVal = Math.max(...districts.map((d) => d.touchpoints_per_voter ?? 0), THRESHOLD, 0.001);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + districts.length * ROW_H;
  const thresholdX = (THRESHOLD / maxVal) * chartW;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Touchpoints per voter by district">
      {districts.map((d, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = Math.max(2, ((d.touchpoints_per_voter ?? 0) / maxVal) * chartW);
        const color = touchpointColor(d.touchpoints_per_voter);
        const label = d.district_name.length > 18 ? d.district_name.slice(0, 16) + "…" : d.district_name;

        return (
          <g key={d.district_id}>
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={color} fontWeight={500}>
              {d.touchpoints_display}
            </text>
          </g>
        );
      })}
      {/* Threshold line */}
      <line
        x1={PAD_LEFT + thresholdX}
        y1={PAD_TOP}
        x2={PAD_LEFT + thresholdX}
        y2={totalH}
        stroke={RED_60}
        strokeDasharray="4 2"
        strokeWidth={1}
      />
      <text x={PAD_LEFT + thresholdX + 4} y={12} fontSize={10} fill={RED_60}>3+ threshold</text>
    </svg>
  );
}
