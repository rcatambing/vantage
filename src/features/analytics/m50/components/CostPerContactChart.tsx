import type { M50ChannelBreakdown } from "../types";

const BLUE_30 = "#82cfff";
const BLUE_50 = "#1192e8";
const BLUE_60 = "#0f62fe";
const RED_60 = "#da1e28";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  channels: M50ChannelBreakdown[];
}

const W = 460;
const PAD_LEFT = 100;
const PAD_RIGHT = 80;
const PAD_TOP = 8;
const BAR_H = 10;
const ROW_H = 32;

function costColor(cost: number | null): string {
  if (cost == null) return GRAY_50;
  if (cost <= 50) return BLUE_30;
  if (cost <= 200) return BLUE_50;
  if (cost <= 500) return BLUE_60;
  return RED_60;
}

export default function CostPerContactChart({ channels }: Props) {
  if (!channels.length) return null;

  const maxVal = Math.max(...channels.map((c) => c.cost_per_contact ?? 0), 0.001);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + channels.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Cost per voter contact by channel">
      {channels.map((c, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = Math.max(2, ((c.cost_per_contact ?? 0) / maxVal) * chartW);
        const color = costColor(c.cost_per_contact);
        const label = c.contact_type.replace("_", " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

        return (
          <g key={c.contact_type}>
            <rect x={PAD_LEFT} y={y + 8} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            <rect x={PAD_LEFT} y={y + 8} width={barW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label.length > 14 ? label.slice(0, 12) + "…" : label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={color} fontWeight={500}>
              {c.cost_display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
