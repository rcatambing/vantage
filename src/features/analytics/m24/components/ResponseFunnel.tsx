const BLUE_40 = "#78a9ff";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";

interface Props {
  invitedCount: number;
  respondedCount: number;
}

const W = 420;
const H = 130;
const PAD_LEFT = 16;
const PAD_RIGHT = 90; // space for labels on the right
const PAD_TOP = 12;
const BAR_H = 32;
const GAP = 20;

export default function ResponseFunnel({ invitedCount, respondedCount }: Props) {
  if (invitedCount === 0) return null;

  const maxCount = invitedCount;
  const chartW = W - PAD_LEFT - PAD_RIGHT;

  const invitedW = chartW;
  const respondedW = Math.max(4, (respondedCount / maxCount) * chartW);

  const dropPct =
    invitedCount > 0
      ? Math.round(((invitedCount - respondedCount) / invitedCount) * 100)
      : 0;

  const respondedRate =
    invitedCount > 0 ? Math.round((respondedCount / invitedCount) * 100) : 0;

  const y1 = PAD_TOP;
  const y2 = PAD_TOP + BAR_H + GAP;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block" }}
      aria-label="Poll response funnel: invited to responded"
    >
      {/* Invited bar */}
      <rect x={PAD_LEFT} y={y1} width={invitedW} height={BAR_H} fill={BLUE_40} opacity={0.7} rx={2} />
      <text x={PAD_LEFT + invitedW + 6} y={y1 + BAR_H / 2 + 4} fontSize={12} fill={BLUE_40} fontWeight={500}>
        {invitedCount.toLocaleString()}
      </text>
      <text x={PAD_LEFT} y={y1 - 4} fontSize={11} fill={GRAY_50}>
        Invited
      </text>

      {/* Drop-off annotation between bars */}
      <text
        x={PAD_LEFT + respondedW + 6}
        y={y1 + BAR_H + GAP / 2 + 4}
        fontSize={11}
        fill={RED_40}
      >
        −{dropPct}% did not respond
      </text>

      {/* Responded bar */}
      <rect x={PAD_LEFT} y={y2} width={respondedW} height={BAR_H} fill={BLUE_40} rx={2} />
      <text x={PAD_LEFT + respondedW + 6} y={y2 + BAR_H / 2 + 4} fontSize={12} fill={BLUE_40} fontWeight={500}>
        {respondedCount.toLocaleString()} ({respondedRate}%)
      </text>
      <text x={PAD_LEFT} y={y2 - 4} fontSize={11} fill={GRAY_50}>
        Responded
      </text>

      {/* Connector lines */}
      <line
        x1={PAD_LEFT}
        y1={y1 + BAR_H}
        x2={PAD_LEFT}
        y2={y2}
        stroke={GRAY_70}
        strokeWidth={1}
        strokeDasharray="2 2"
      />
    </svg>
  );
}
