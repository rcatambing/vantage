import { Spinner, NonIdealState, Classes } from "@blueprintjs/core";
import type { MetricM03GenderRow } from "../../types";

interface Props {
  data: MetricM03GenderRow[];
  loading?: boolean;
}

const MALE_COLOR = "#78a9ff";
const FEMALE_COLOR = "#ff7eb6";

const fmt = new Intl.NumberFormat("en-PH");

const paddingLeft = 48;
const paddingRight = 48;
const paddingTop = 16;
const paddingBottom = 32;
const centerX = 350;
const barHeight = 32;
const barGap = 8;
const maxBarWidth = 240;
const labelGap = 32;

export default function AgeDemographicsPopulationPyramid({ data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <NonIdealState
        icon="grouped-bar-chart"
        title="No data"
        description="No age demographics match the current filters."
      />
    );
  }

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.male, d.female]),
    1
  );

  // Render oldest bracket at top — sort ascending, then render in reverse
  const sorted = [...data].sort((a, b) => {
    const order = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
    return order.indexOf(a.age_bracket) - order.indexOf(b.age_bracket);
  });
  const reversed = [...sorted].reverse();

  const rowCount = reversed.length;
  const svgHeight = paddingTop + paddingBottom + rowCount * (barHeight + barGap) + 40; // +40 for legend

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Population Pyramid
      </div>

      <svg
        viewBox={`0 0 700 ${svgHeight}`}
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Population Pyramid by Age Bracket"
      >
        {/* Legend */}
        <g>
          <rect x={centerX - 120} y={4} width={12} height={12} fill={MALE_COLOR} />
          <text x={centerX - 104} y={14} style={{ fill: "var(--cds-text-secondary)" }} fontSize="12">Male</text>
          <rect x={centerX + 60} y={4} width={12} height={12} fill={FEMALE_COLOR} />
          <text x={centerX + 76} y={14} style={{ fill: "var(--cds-text-secondary)" }} fontSize="12">Female</text>
        </g>

        {/* Rows */}
        {reversed.map((d, i) => {
          const y = paddingTop + 28 + i * (barHeight + barGap); // +28 for legend offset
          const maleWidth = (d.male / maxValue) * maxBarWidth;
          const femaleWidth = (d.female / maxValue) * maxBarWidth;

          return (
            <g key={d.age_bracket}>
              {/* Male bar — extends leftward */}
              <rect
                x={centerX - labelGap - maleWidth}
                y={y}
                width={maleWidth}
                height={barHeight}
                fill={MALE_COLOR}
              >
                <title>{`${d.age_bracket} Male: ${fmt.format(d.male)}`}</title>
              </rect>

              {/* Female bar — extends rightward */}
              <rect
                x={centerX + labelGap}
                y={y}
                width={femaleWidth}
                height={barHeight}
                fill={FEMALE_COLOR}
              >
                <title>{`${d.age_bracket} Female: ${fmt.format(d.female)}`}</title>
              </rect>

              {/* Center age bracket label */}
              <text
                x={centerX}
                y={y + barHeight / 2 + 4}
                style={{ fill: "var(--cds-text-secondary)" }}
                fontSize="11"
                textAnchor="middle"
              >
                {d.age_bracket}
              </text>
            </g>
          );
        })}

        {/* X-axis directional labels */}
        <text
          x={paddingLeft}
          y={svgHeight - 4}
          style={{ fill: "var(--cds-text-secondary)" }}
          fontSize="12"
          textAnchor="start"
        >
          ← Male
        </text>
        <text
          x={700 - paddingRight}
          y={svgHeight - 4}
          style={{ fill: "var(--cds-text-secondary)" }}
          fontSize="12"
          textAnchor="end"
        >
          Female →
        </text>
      </svg>

      {data.some((d) => d.other > 0) && (
        <p className={Classes.TEXT_MUTED} style={{ fontSize: 11, letterSpacing: "0.32px", marginTop: 4 }}>
          * Non-binary / other voters not shown. Use the Bar Chart view for full breakdown.
        </p>
      )}
    </div>
  );
}
