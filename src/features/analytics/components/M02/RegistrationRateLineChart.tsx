import { Spinner, NonIdealState, Classes } from "@blueprintjs/core";

export interface RegistrationRateTrendPoint {
  year: number;
  registered: number;
}

export interface RegistrationRateTrendSeries {
  label: string;
  color: string;
  points: RegistrationRateTrendPoint[];
}

interface Props {
  title: string;
  data: RegistrationRateTrendSeries[];
  loading?: boolean;
}

const Y_TICKS_COUNT = 5;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function niceMax(value: number): number {
  if (value <= 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

export default function RegistrationRateLineChart({ title, data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 220 }}>
        <Spinner size={32} />
      </div>
    );
  }

  const allYears = Array.from(
    new Set(
      data.flatMap((series) =>
        series.points
          .map((point) => point.year)
          .filter((year): year is number => Number.isFinite(year))
      )
    )
  ).sort((a, b) => a - b);

  const allValues = data.flatMap((series) =>
    series.points.map((point) => point.registered)
  );
  const rawMax = Math.max(...allValues, 1);
  const yMax = niceMax(rawMax);
  const yTickStep = yMax / Y_TICKS_COUNT;
  const yTicks = Array.from({ length: Y_TICKS_COUNT + 1 }, (_, i) => Math.round(i * yTickStep));

  if (data.length === 0 || allYears.length === 0) {
    return (
      <NonIdealState
        icon="timeline-line-chart"
        title="No trend data"
        description="No trend points are available for the selected filters."
      />
    );
  }

  const width = 700;
  const height = 260;
  const paddingTop = 20;
  const paddingRight = 20;
  const paddingBottom = 44;
  const paddingLeft = 50;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const minYear = allYears[0];
  const maxYear = allYears[allYears.length - 1];

  const xForYear = (year: number) => {
    if (minYear === maxYear) {
      return paddingLeft + plotWidth / 2;
    }
    return paddingLeft + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  };

  const yForValue = (value: number) => {
    const normalized = clamp(value, 0, yMax) / yMax;
    return paddingTop + (1 - normalized) * plotHeight;
  };

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        {title}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="260" role="img" aria-label={title}>
        <line
          x1={paddingLeft}
          y1={paddingTop + plotHeight}
          x2={paddingLeft + plotWidth}
          y2={paddingTop + plotHeight}
          stroke="#6f6f6f"
          strokeWidth="1"
        />
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={paddingTop + plotHeight}
          stroke="#6f6f6f"
          strokeWidth="1"
        />

        {yTicks.map((tick) => {
          const y = yForValue(tick);
          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + plotWidth}
                y2={y}
                stroke="#525252"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <text x={paddingLeft - 8} y={y + 4} fill="#c6c6c6" fontSize="12" textAnchor="end">
                {tick.toLocaleString("en-PH")}
              </text>
            </g>
          );
        })}

        {allYears.map((year) => {
          const x = xForYear(year);
          return (
            <g key={year}>
              <line
                x1={x}
                y1={paddingTop + plotHeight}
                x2={x}
                y2={paddingTop + plotHeight + 6}
                stroke="#6f6f6f"
                strokeWidth="1"
              />
              <text x={x} y={paddingTop + plotHeight + 20} fill="#c6c6c6" fontSize="12" textAnchor="middle">
                {year}
              </text>
            </g>
          );
        })}

        {data.map((series) => {
          const points = [...series.points].sort((a, b) => a.year - b.year);
          const pointCoordinates = points.map((point) => `${xForYear(point.year)},${yForValue(point.registered)}`).join(" ");

          return (
            <g key={series.label}>
              {points.length > 1 && (
                <polyline
                  points={pointCoordinates}
                  fill="none"
                  stroke={series.color}
                  strokeWidth="2"
                />
              )}

              {points.map((point) => (
                <circle
                  key={`${series.label}-${point.year}`}
                  cx={xForYear(point.year)}
                  cy={yForValue(point.registered)}
                  r="4"
                  fill={series.color}
                >
                  <title>{`${series.label} ${point.year}: ${point.registered.toLocaleString("en-PH")} registered`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
        {data.map((series) => (
          <div key={`legend-${series.label}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 0,
                background: series.color,
              }}
            />
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
              {series.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
