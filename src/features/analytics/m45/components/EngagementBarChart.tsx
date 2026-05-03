import type { M45PlatformBreakdown } from "../types";

const BLUE_30 = "#82cfff";
const BLUE_50 = "#1192e8";
const BLUE_60 = "#0f62fe";
const TEAL_50 = "#009d9a";
const PURPLE_50 = "#8a3ffc";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  platforms: M45PlatformBreakdown[];
}

const RED_40 = "#ff8389";

const PLATFORM_COLORS: Record<string, string> = {
  facebook: BLUE_60,
  twitter: BLUE_50,
  instagram: PURPLE_50,
  tiktok: TEAL_50,
  youtube: RED_40,
  linkedin: BLUE_30,
};

const W = 460;
const PAD_LEFT = 120;
const PAD_RIGHT = 70;
const PAD_TOP = 8;
const BAR_H = 10;
const ROW_H = 32;

export default function EngagementBarChart({ platforms }: Props) {
  if (!platforms.length) return null;

  const maxVal = Math.max(...platforms.map((p) => p.engagement_rate ?? 0), 0.001);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + platforms.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Social media engagement rate by platform">
      {platforms.map((p, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = Math.max(2, ((p.engagement_rate ?? 0) / maxVal) * chartW);
        const color = PLATFORM_COLORS[p.platform] || BLUE_50;
        const label = p.platform.charAt(0).toUpperCase() + p.platform.slice(1);

        return (
          <g key={p.platform}>
            <rect x={PAD_LEFT} y={y + 6} width={chartW} height={BAR_H} fill={GRAY_80} rx={2} />
            <rect x={PAD_LEFT} y={y + 6} width={barW} height={BAR_H} fill={color} rx={2} />
            <text x={PAD_LEFT - 6} y={y + 16} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 16} fontSize={11} fill={color} fontWeight={500}>
              {p.engagement_display}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
