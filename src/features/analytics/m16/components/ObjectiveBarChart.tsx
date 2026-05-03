import type { M16Objective } from "../types";

interface Props {
  objectives: M16Objective[];
  average: number;
}

const BAR_HEIGHT = 20;
const ROW_HEIGHT = 32;
const LABEL_WIDTH = 160;
const COUNT_WIDTH = 40;
const MIN_SVG_WIDTH = 340;

export default function ObjectiveBarChart({ objectives, average }: Props) {
  if (objectives.length === 0) return null;

  const maxCount = Math.max(...objectives.map((o) => o.task_count), 1);
  const svgHeight = objectives.length * ROW_HEIGHT + 24; // 24px for bottom axis
  const barAreaWidth = MIN_SVG_WIDTH - LABEL_WIDTH - COUNT_WIDTH;
  const avgX = LABEL_WIDTH + (average / maxCount) * barAreaWidth;

  return (
    <svg
      viewBox={`0 0 ${MIN_SVG_WIDTH} ${svgHeight}`}
      style={{ width: "100%", display: "block" }}
      aria-label="Objective task coverage chart"
      role="img"
    >
      {objectives.map((obj, i) => {
        const y = i * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
        const barW = obj.task_count > 0 ? (obj.task_count / maxCount) * barAreaWidth : 0;
        const isEmpty = obj.task_count === 0;
        const barColor = isEmpty ? "#da1e28" : "var(--cds-interactive)";
        const rowBg = isEmpty ? "#fff1f1" : "transparent";

        return (
          <g key={String(obj.objective_id)}>
            {/* Row highlight for empty objectives */}
            {isEmpty && (
              <rect
                x={0}
                y={i * ROW_HEIGHT}
                width={MIN_SVG_WIDTH}
                height={ROW_HEIGHT}
                fill={rowBg}
                fillOpacity={0.6}
              />
            )}
            {/* Label (truncated via foreignObject) */}
            <text
              x={LABEL_WIDTH - 6}
              y={i * ROW_HEIGHT + ROW_HEIGHT / 2}
              dominantBaseline="middle"
              textAnchor="end"
              style={{
                fontSize: 11,
                fill: isEmpty ? "#da1e28" : "var(--cds-text-secondary)",
                fontWeight: isEmpty ? 600 : 400,
              }}
            >
              {obj.objective_title.length > 22
                ? `${obj.objective_title.slice(0, 21)}…`
                : obj.objective_title}
            </text>
            {/* Bar */}
            {barW > 0 && (
              <rect
                x={LABEL_WIDTH}
                y={y}
                width={barW}
                height={BAR_HEIGHT}
                fill={barColor}
                rx={2}
              />
            )}
            {/* Zero marker */}
            {isEmpty && (
              <text
                x={LABEL_WIDTH + 4}
                y={i * ROW_HEIGHT + ROW_HEIGHT / 2}
                dominantBaseline="middle"
                style={{ fontSize: 10, fill: "#da1e28" }}
              >
                No tasks
              </text>
            )}
            {/* Count label */}
            {barW > 0 && (
              <text
                x={LABEL_WIDTH + barW + 4}
                y={i * ROW_HEIGHT + ROW_HEIGHT / 2}
                dominantBaseline="middle"
                style={{ fontSize: 11, fill: "var(--cds-text-secondary)" }}
              >
                {obj.task_count}
              </text>
            )}
          </g>
        );
      })}

      {/* Average reference line */}
      {average > 0 && (
        <g>
          <line
            x1={avgX}
            y1={0}
            x2={avgX}
            y2={svgHeight - 24}
            stroke="#6f6f6f"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <text
            x={avgX + 3}
            y={svgHeight - 14}
            style={{ fontSize: 9, fill: "#6f6f6f" }}
          >
            avg {average.toFixed(1)}
          </text>
        </g>
      )}

      {/* Bottom axis */}
      <line
        x1={LABEL_WIDTH}
        y1={svgHeight - 22}
        x2={LABEL_WIDTH + barAreaWidth}
        y2={svgHeight - 22}
        stroke="#e0e0e0"
        strokeWidth={1}
      />
    </svg>
  );
}
