import type { M46MaterialBreakdown } from "../types";

const GREEN_40 = "#42be65";
const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  materials: M46MaterialBreakdown[];
}

const W = 460;
const PAD_LEFT = 140;
const PAD_RIGHT = 70;
const PAD_TOP = 8;
const BAR_H = 8;
const ROW_H = 28;

function distributionColor(pct: number | null): string {
  if (pct == null) return GRAY_50;
  if (pct >= 80) return GREEN_40;
  if (pct >= 50) return YELLOW_30;
  return RED_40;
}

export default function MaterialProgressChart({ materials }: Props) {
  if (!materials.length) return null;

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + materials.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Material distribution progress by type">
      {materials.map((m, i) => {
        const y = PAD_TOP + i * ROW_H;
        const pct = m.distribution_rate ?? 0;
        const barW = Math.max(2, (pct / 100) * chartW);
        const color = distributionColor(m.distribution_rate);
        const label = m.material_type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <g key={m.material_type}>
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label.length > 16 ? label.slice(0, 14) + "…" : label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={color} fontWeight={500}>
              {m.distribution_display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
