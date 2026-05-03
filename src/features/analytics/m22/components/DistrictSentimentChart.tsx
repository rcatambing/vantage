/** SVG horizontal bar chart for district avg_sentiment, sorted descending */
import type { M22District } from "../types";

const ROW_H = 36;
const BAR_LEFT = 154;
const BAR_MAX_W = 180;
const STDDEV_X = BAR_LEFT + BAR_MAX_W + 8;
const COUNT_X = STDDEV_X + 54;
const VW = COUNT_X + 44;
const PAD_TOP = 6;
const PAD_BOT = 6;

function sentimentColor(val: number): string {
  if (val >= 4) return "#4CAF50";
  if (val >= 3) return "var(--cds-interactive, #0f62fe)";
  if (val >= 2) return "#f1c21b";
  return "#E53935";
}

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  districts: M22District[];
}

export default function DistrictSentimentChart({ districts }: Props) {
  if (districts.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#888", padding: 24, fontSize: 12 }}>
        No district data available
      </div>
    );
  }

  // Sort descending by avg_sentiment, cap at 15
  const sorted = [...districts]
    .sort((a, b) => (b.avg_sentiment ?? 0) - (a.avg_sentiment ?? 0))
    .slice(0, 15);

  const n = sorted.length;
  const totalH = PAD_TOP + n * ROW_H + PAD_BOT;

  return (
    <svg
      viewBox={`0 0 ${VW} ${totalH}`}
      width="100%"
      role="img"
      aria-label="Regional sentiment variance bar chart"
    >
      {sorted.map((dist, i) => {
        const y = PAD_TOP + i * ROW_H;
        const rowMidY = y + ROW_H / 2;
        const val = dist.avg_sentiment ?? 0;
        const barW = (val / 5) * BAR_MAX_W;
        const color = dist.avg_sentiment != null ? sentimentColor(val) : "#ccc";

        const nameLabel =
          dist.district_name.length > 18
            ? dist.district_name.slice(0, 17) + "…"
            : dist.district_name;

        return (
          <g key={dist.district_id}>
            {/* District label */}
            <text
              x={0}
              y={rowMidY - 4}
              textAnchor="start"
              fontSize={11}
              fill="currentColor"
            >
              {nameLabel}
            </text>
            <text
              x={0}
              y={rowMidY + 8}
              textAnchor="start"
              fontSize={9}
              fill="#888"
            >
              {dist.city}
            </text>

            {/* Background bar */}
            <rect
              x={BAR_LEFT}
              y={y + 9}
              width={BAR_MAX_W}
              height={ROW_H - 18}
              rx={2}
              fill="#e8e8e8"
            />
            {/* Filled bar */}
            {dist.avg_sentiment != null && barW > 0 && (
              <rect
                x={BAR_LEFT}
                y={y + 9}
                width={barW}
                height={ROW_H - 18}
                rx={2}
                fill={color}
                style={{ transition: "width 0.3s ease" }}
              >
                <title>
                  {dist.district_name}: {val.toFixed(2)} avg
                  {dist.stddev_sentiment != null
                    ? ` ±${dist.stddev_sentiment.toFixed(2)}`
                    : ""}
                </title>
              </rect>
            )}

            {/* avg value + stddev */}
            <text
              x={STDDEV_X}
              y={rowMidY - 3}
              textAnchor="start"
              fontSize={11}
              fontWeight={600}
              fill={color}
            >
              {dist.avg_sentiment != null ? val.toFixed(2) : "—"}
            </text>
            {dist.stddev_sentiment != null && (
              <text
                x={STDDEV_X}
                y={rowMidY + 9}
                textAnchor="start"
                fontSize={9}
                fill="#888"
              >
                ±{dist.stddev_sentiment.toFixed(2)}
              </text>
            )}

            {/* Response count badge */}
            <text
              x={COUNT_X}
              y={rowMidY}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize={10}
              fill="#888"
            >
              {fmtNum.format(dist.response_count)}
            </text>

            {/* Row separator */}
            {i < n - 1 && (
              <line
                x1={0}
                y1={y + ROW_H}
                x2={VW}
                y2={y + ROW_H}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
