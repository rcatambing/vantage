/** SVG horizontal bar chart for ranked issues by share_pct */
import type { M20RankedIssue } from "../types";

const ROW_H = 34;
const BAR_LEFT = 176;
const BAR_MAX_W = 186;
const VALUE_X = BAR_LEFT + BAR_MAX_W + 8;
const VW = VALUE_X + 44;
const PAD_TOP = 4;
const PAD_BOT = 4;

const BAR_COLOR = "var(--cds-interactive, #0f62fe)";
const BAR_BG = "#e8e8e8";

interface Props {
  rankedIssues: M20RankedIssue[];
}

export default function IssueSalienceBarChart({ rankedIssues }: Props) {
  const n = rankedIssues.length;
  if (n === 0) {
    return (
      <div style={{ textAlign: "center", color: "#888", padding: 24, fontSize: 12 }}>
        No issue data available
      </div>
    );
  }

  const totalH = PAD_TOP + n * ROW_H + PAD_BOT;

  return (
    <svg
      viewBox={`0 0 ${VW} ${totalH}`}
      width="100%"
      role="img"
      aria-label="Issue salience ranked bar chart"
    >
      {rankedIssues.map((issue, i) => {
        const y = PAD_TOP + i * ROW_H;
        const barW = (issue.share_pct / 100) * BAR_MAX_W;
        const label =
          issue.issue_text.length > 22
            ? issue.issue_text.slice(0, 21) + "…"
            : issue.issue_text;
        const rowMidY = y + ROW_H / 2;

        return (
          <g key={issue.rank}>
            {/* Rank badge */}
            <text
              x={18}
              y={rowMidY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fontWeight={600}
              fill="#888"
            >
              #{issue.rank}
            </text>
            {/* Issue label */}
            <text
              x={28}
              y={rowMidY}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize={11}
              fill="currentColor"
            >
              {label}
            </text>
            {/* Background bar */}
            <rect
              x={BAR_LEFT}
              y={y + 8}
              width={BAR_MAX_W}
              height={ROW_H - 16}
              rx={2}
              fill={BAR_BG}
            />
            {/* Filled bar */}
            {barW > 0 && (
              <rect
                x={BAR_LEFT}
                y={y + 8}
                width={barW}
                height={ROW_H - 16}
                rx={2}
                fill={BAR_COLOR}
                style={{ transition: "width 0.3s ease" }}
              >
                <title>
                  {issue.issue_text}: {issue.share_pct.toFixed(1)}% ({issue.count} responses)
                </title>
              </rect>
            )}
            {/* share_pct label */}
            <text
              x={VALUE_X}
              y={rowMidY}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={600}
              fill="var(--cds-interactive, #0f62fe)"
            >
              {issue.share_pct.toFixed(1)}%
            </text>
          </g>
        );
      })}
      {/* Separator lines between rows */}
      {rankedIssues.slice(0, -1).map((issue) => (
        <line
          key={`sep-${issue.rank}`}
          x1={0}
          y1={PAD_TOP + issue.rank * ROW_H}
          x2={VW}
          y2={PAD_TOP + issue.rank * ROW_H}
          stroke="#f0f0f0"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}


