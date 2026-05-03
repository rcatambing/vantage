import type { M25Ranking } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";

interface Props {
  rankings: M25Ranking[];
  ourCandidate: string;
}

const W = 460;
const BAR_H = 24;
const GAP = 8;
const PAD_LEFT = 16;
const PAD_RIGHT = 60; // room for percentage label
const PAD_TOP = 8;
const MAX_LABEL_W = 130;
const BAR_AREA_W = W - PAD_LEFT - PAD_RIGHT - MAX_LABEL_W;

export default function CandidateBarChart({ rankings, ourCandidate }: Props) {
  if (!rankings.length) return null;

  const maxCount = Math.max(...rankings.map((r) => r.count), 1);
  const totalH = PAD_TOP + rankings.length * (BAR_H + GAP);

  return (
    <svg
      viewBox={`0 0 ${W} ${totalH}`}
      width="100%"
      style={{ display: "block" }}
      aria-label="Candidate head-to-head comparison"
    >
      {rankings.map((entry, i) => {
        const isOurs = entry.candidate === ourCandidate;
        const barW = Math.max(2, (entry.count / maxCount) * BAR_AREA_W);
        const y = PAD_TOP + i * (BAR_H + GAP);
        const x = PAD_LEFT + MAX_LABEL_W + 4;
        const labelName =
          entry.candidate.length > 18 ? entry.candidate.slice(0, 16) + "…" : entry.candidate;

        return (
          <g key={entry.candidate}>
            {/* Divider after our candidate (before first opponent) */}
            {i === 1 && (
              <line
                x1={PAD_LEFT}
                y1={y - GAP / 2}
                x2={W - PAD_RIGHT + 50}
                y2={y - GAP / 2}
                stroke={GRAY_70}
                strokeWidth={1}
              />
            )}

            {/* Candidate name label */}
            <text
              x={PAD_LEFT + MAX_LABEL_W}
              y={y + BAR_H / 2 + 4}
              textAnchor="end"
              fontSize={12}
              fill={isOurs ? BLUE_40 : GRAY_50}
              fontWeight={isOurs ? 600 : 400}
            >
              {labelName}
            </text>

            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barW}
              height={BAR_H}
              fill={isOurs ? BLUE_40 : GRAY_50}
              opacity={isOurs ? 1 : 0.6}
              rx={2}
            />

            {/* Percentage label at right edge of bar */}
            <text
              x={x + barW + 6}
              y={y + BAR_H / 2 + 4}
              fontSize={11}
              fill={isOurs ? BLUE_40 : GRAY_50}
            >
              {entry.share_pct != null ? `${entry.share_pct}%` : "—"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
