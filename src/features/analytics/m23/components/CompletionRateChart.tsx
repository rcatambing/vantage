import type { M23PollBreakdown } from "../types";

interface Props {
  polls: M23PollBreakdown[];
  overallRate: number | null;
  threshold?: number;
}

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";
const RED_40 = "#ff8389";
const GRAY_70 = "#525252";
const THRESHOLD_DEFAULT = 60;

const W = 480;
const H = 200;
const PAD_LEFT = 140;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;
const CHART_W = W - PAD_LEFT - PAD_RIGHT;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

export default function CompletionRateChart({ polls, overallRate: _overallRate, threshold = THRESHOLD_DEFAULT }: Props) {
  if (!polls.length) return null;

  const maxPct = 100;
  const thresholdY = PAD_TOP + CHART_H - (threshold / maxPct) * CHART_H;

  const barWidth = Math.max(12, Math.floor((CHART_W / polls.length) * 0.6));
  const groupW = CHART_W / polls.length;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block" }}
        aria-label="Poll completion rate by poll"
      >
        {/* Y-axis gridlines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = PAD_TOP + CHART_H - (pct / maxPct) * CHART_H;
          return (
            <g key={pct}>
              <line x1={PAD_LEFT} y1={y} x2={W - PAD_RIGHT} y2={y} stroke={GRAY_70} strokeWidth={0.5} />
              <text x={PAD_LEFT - 6} y={y + 4} textAnchor="end" fontSize={10} fill={GRAY_50}>
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Threshold line (dashed, labelled) */}
        <line
          x1={PAD_LEFT}
          y1={thresholdY}
          x2={W - PAD_RIGHT}
          y2={thresholdY}
          stroke={RED_40}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text
          x={W - PAD_RIGHT - 4}
          y={thresholdY - 4}
          textAnchor="end"
          fontSize={11}
          fill={RED_40}
          fontWeight={500}
        >
          {threshold}% target
        </text>

        {/* Bars */}
        {polls.map((poll, i) => {
          const rate = poll.completion_rate ?? 0;
          const barH = (rate / maxPct) * CHART_H;
          const x = PAD_LEFT + i * groupW + (groupW - barWidth) / 2;
          const y = PAD_TOP + CHART_H - barH;
          const color = rate >= threshold ? BLUE_40 : RED_40;
          const labelName =
            poll.poll_name.length > 14 ? poll.poll_name.slice(0, 12) + "…" : poll.poll_name;

          return (
            <g key={poll.poll_id}>
              <rect x={x} y={y} width={barWidth} height={barH} fill={color} rx={2} />
              {/* Rate label above bar */}
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={10}
                fill={color}
              >
                {poll.completion_rate != null ? `${poll.completion_rate}%` : "—"}
              </text>
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={PAD_TOP + CHART_H + 14}
                textAnchor="middle"
                fontSize={10}
                fill={GRAY_50}
              >
                {labelName}
              </text>
            </g>
          );
        })}

        {/* Axis lines */}
        <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + CHART_H} stroke={GRAY_70} strokeWidth={1} />
        <line x1={PAD_LEFT} y1={PAD_TOP + CHART_H} x2={W - PAD_RIGHT} y2={PAD_TOP + CHART_H} stroke={GRAY_70} strokeWidth={1} />
      </svg>
      {/* Axis title tooltip note */}
      <div style={{ fontSize: 11, color: GRAY_50, marginTop: 4, paddingLeft: PAD_LEFT }}>
        Completion rate by respondent identifier
        <span
          title="Breakdown uses the respondent field from poll sessions — not a verified enumerator identity."
          style={{ cursor: "help", marginLeft: 4 }}
        >
          ⓘ
        </span>
      </div>
    </div>
  );
}
