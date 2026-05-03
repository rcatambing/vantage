import type { M13Phase, PhaseDirection } from "../types";

const DIRECTION_COLORS: Record<PhaseDirection, string> = {
  AHEAD: "#24a148",
  ON_TIME: "#6f6f6f",
  BEHIND: "#da1e28",
  PENDING: "#e0e0e0",
};

const DIRECTION_LABELS: Record<PhaseDirection, string> = {
  AHEAD: "Ahead",
  ON_TIME: "On Time",
  BEHIND: "Behind",
  PENDING: "Pending",
};

const VIEW_WIDTH = 560;
const ROW_HEIGHT = 60;
const PADDING_X = 80;
const TIMELINE_Y_START = 20;
const TIMELINE_Y_GAP = ROW_HEIGHT;

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  phases: M13Phase[];
}

export default function PhaseScheduleChart({ phases }: Props) {
  if (phases.length === 0) {
    return <svg viewBox={`0 0 ${VIEW_WIDTH} 80`} style={{ width: "100%" }} />;
  }

  // Collect all dates to compute timeline extent
  const allDates: Date[] = [];
  phases.forEach((p) => {
    if (p.target_date) allDates.push(new Date(p.target_date));
    if (p.actual_date) allDates.push(new Date(p.actual_date));
  });

  const today = new Date();
  allDates.push(today);

  const minTime = Math.min(...allDates.map((d) => d.getTime()));
  const maxTime = Math.max(...allDates.map((d) => d.getTime()));

  const timeRange = maxTime - minTime || 1;
  const usableWidth = VIEW_WIDTH - PADDING_X * 2;

  function toX(iso: string | null): number {
    if (!iso) return -1;
    const t = new Date(iso).getTime();
    return PADDING_X + ((t - minTime) / timeRange) * usableWidth;
  }

  const totalHeight = TIMELINE_Y_START + phases.length * TIMELINE_Y_GAP + 20;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${totalHeight}`}
      style={{ width: "100%", display: "block" }}
      aria-label="Campaign phase schedule comparison chart"
      role="img"
    >
      {/* Today reference line */}
      {(() => {
        const tx = PADDING_X + ((today.getTime() - minTime) / timeRange) * usableWidth;
        return (
          <g>
            <line
              x1={tx}
              y1={TIMELINE_Y_START - 8}
              x2={tx}
              y2={totalHeight - 4}
              stroke="#8d8d8d"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text x={tx + 3} y={TIMELINE_Y_START - 2} style={{ fontSize: 9, fill: "#8d8d8d" }}>
              Today
            </text>
          </g>
        );
      })()}

      {phases.map((phase, i) => {
        const rowY = TIMELINE_Y_START + i * TIMELINE_Y_GAP + ROW_HEIGHT / 2;
        const targetX = toX(phase.target_date);
        const actualX = toX(phase.actual_date);
        const color = DIRECTION_COLORS[phase.direction];
        const phaseLabel = phase.phase === "start" ? "Campaign Start" : "Campaign End";

        return (
          <g key={phase.phase}>
            {/* Row label */}
            <text
              x={PADDING_X - 8}
              y={rowY}
              textAnchor="end"
              dominantBaseline="middle"
              style={{ fontSize: 11, fill: "var(--cds-text-secondary)" }}
            >
              {phaseLabel}
            </text>

            {/* Baseline track */}
            <line
              x1={PADDING_X}
              y1={rowY}
              x2={PADDING_X + usableWidth}
              y2={rowY}
              stroke="#e0e0e0"
              strokeWidth={1}
            />

            {/* Target pin (gray circle + date) */}
            {targetX >= 0 && (
              <g>
                <circle cx={targetX} cy={rowY} r={6} fill="#e0e0e0" stroke="#8d8d8d" strokeWidth={1.5} />
                <line
                  x1={targetX}
                  y1={rowY - 6}
                  x2={targetX}
                  y2={rowY - 18}
                  stroke="#8d8d8d"
                  strokeWidth={1}
                />
                <text
                  x={targetX}
                  y={rowY - 22}
                  textAnchor="middle"
                  style={{ fontSize: 9, fill: "#8d8d8d" }}
                >
                  {formatDate(phase.target_date)}
                </text>
                <text
                  x={targetX}
                  y={rowY - 32}
                  textAnchor="middle"
                  style={{ fontSize: 9, fill: "#8d8d8d" }}
                >
                  Target
                </text>
              </g>
            )}

            {/* Actual / pending pin */}
            {phase.direction === "PENDING" ? (
              /* dashed ghost pin if pending */
              targetX >= 0 && (
                <g>
                  <circle
                    cx={targetX + 12}
                    cy={rowY}
                    r={6}
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth={1.5}
                    strokeDasharray="3 2"
                  />
                  <text
                    x={targetX + 12}
                    y={rowY + 22}
                    textAnchor="middle"
                    style={{ fontSize: 9, fill: "#e0e0e0" }}
                  >
                    Pending
                  </text>
                </g>
              )
            ) : (
              actualX >= 0 && (
                <g>
                  {/* Variance connector line */}
                  {targetX >= 0 && (
                    <line
                      x1={Math.min(targetX, actualX)}
                      y1={rowY}
                      x2={Math.max(targetX, actualX)}
                      y2={rowY}
                      stroke={color}
                      strokeWidth={2}
                    />
                  )}
                  <circle cx={actualX} cy={rowY} r={6} fill={color} />
                  <line
                    x1={actualX}
                    y1={rowY + 6}
                    x2={actualX}
                    y2={rowY + 18}
                    stroke={color}
                    strokeWidth={1}
                  />
                  <text
                    x={actualX}
                    y={rowY + 23}
                    textAnchor="middle"
                    style={{ fontSize: 9, fill: color }}
                  >
                    {formatDate(phase.actual_date)}
                  </text>
                  <text
                    x={actualX}
                    y={rowY + 33}
                    textAnchor="middle"
                    style={{ fontSize: 9, fill: color }}
                  >
                    Actual · {DIRECTION_LABELS[phase.direction]}
                  </text>
                </g>
              )
            )}
          </g>
        );
      })}
    </svg>
  );
}
