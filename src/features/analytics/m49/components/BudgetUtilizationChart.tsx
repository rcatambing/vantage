import type { M49CategoryBreakdown } from "../types";

const YELLOW_30 = "#f1c21b";
const RED_40 = "#ff8389";
const BLUE_60 = "#0f62fe";
const BLUE_30 = "#82cfff";
const GRAY_50 = "#8d8d8d";

interface Props {
  categories: M49CategoryBreakdown[];
}

const W = 520;
const PAD_LEFT = 140;
const PAD_RIGHT = 80;
const PAD_TOP = 8;
const BAR_H = 10;
const ROW_H = 32;

function utilizationColor(pct: number | null, overBudget: boolean, nearCap: boolean): string {
  if (overBudget) return RED_40;
  if (nearCap) return YELLOW_30;
  if (pct == null) return GRAY_50;
  if (pct >= 80) return YELLOW_30;
  if (pct >= 50) return BLUE_60;
  return BLUE_30;
}

export default function BudgetUtilizationChart({ categories }: Props) {
  if (!categories.length) return null;

  const maxVal = Math.max(...categories.map((c) => c.allocated), 1);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + categories.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Budget utilization by category">
      {categories.map((c, i) => {
        const y = PAD_TOP + i * ROW_H;
        const allocatedW = Math.max(2, (c.allocated / maxVal) * chartW);
        const spentW = Math.max(2, (c.spent / maxVal) * chartW);
        const color = utilizationColor(c.utilization_rate, c.over_budget, c.near_cap);
        const label = c.category.replace("_", " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

        return (
          <g key={c.category}>
            {/* Allocated bar (track) */}
            <rect x={PAD_LEFT} y={y + 6} width={allocatedW} height={BAR_H} fill={BLUE_30} rx={2} opacity={0.4} />
            {/* Spent bar */}
            <rect x={PAD_LEFT} y={y + 6} width={spentW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label.length > 18 ? label.slice(0, 16) + "…" : label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 14} fontSize={10} fill={color} fontWeight={500}>
              {c.utilization_display}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 26} fontSize={9} fill={GRAY_50}>
              ₱{(c.spent / 100).toLocaleString()} / ₱{(c.allocated / 100).toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
