import type { M26TrendEntry } from "../types";

const BLUE_40 = "#78a9ff";
const RED_40 = "#ff8389";
const GRAY_50 = "#8d8d8d";
const GRAY_70 = "#525252";

interface SingleMarginProps {
  margin: number | null;
  lowerBound: number | null;
  upperBound: number | null;
  hasMoe: boolean;
  ourCandidate: string;
  opponentCandidate: string;
}

const W = 420;
const H = 80;
const CENTER_X = W / 2;
const Y_MID = 40;
const BAR_H = 20;

function clampX(val: number, absMax: number): number {
  return CENTER_X + (val / absMax) * (CENTER_X - 24);
}

export function MarginRangeBar({
  margin,
  lowerBound,
  upperBound,
  hasMoe,
  ourCandidate,
  opponentCandidate,
}: SingleMarginProps) {
  const absMax = Math.max(
    Math.abs(lowerBound ?? margin ?? 0),
    Math.abs(upperBound ?? margin ?? 0),
    10,
  );

  const marginX = margin != null ? clampX(margin, absMax) : CENTER_X;
  const lbX = lowerBound != null ? clampX(lowerBound, absMax) : marginX;
  const ubX = upperBound != null ? clampX(upperBound, absMax) : marginX;

  const fillColor = margin == null ? GRAY_50 : margin > 0 ? BLUE_40 : margin < 0 ? RED_40 : GRAY_50;
  const barY = Y_MID - BAR_H / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} aria-label="Margin of victory range">
      {/* Axis labels */}
      <text x={24} y={H - 6} fontSize={10} fill={GRAY_50} textAnchor="middle">
        {opponentCandidate.slice(0, 10)}
      </text>
      <text x={W - 24} y={H - 6} fontSize={10} fill={BLUE_40} textAnchor="middle">
        {ourCandidate.slice(0, 10)}
      </text>

      {/* Zero reference line */}
      <line
        x1={CENTER_X}
        y1={4}
        x2={CENTER_X}
        y2={H - 16}
        stroke={GRAY_70}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={CENTER_X} y={H - 6} fontSize={10} fill={GRAY_50} textAnchor="middle">
        0%
      </text>

      {hasMoe ? (
        <>
          {/* Confidence interval bar */}
          <rect
            x={Math.min(lbX, ubX)}
            y={barY}
            width={Math.abs(ubX - lbX)}
            height={BAR_H}
            fill={fillColor}
            opacity={0.25}
            rx={2}
          />
          {/* Center margin mark */}
          <rect x={marginX - 2} y={barY} width={4} height={BAR_H} fill={fillColor} rx={1} />
          {/* Whisker caps */}
          <line x1={lbX} y1={barY} x2={lbX} y2={barY + BAR_H} stroke={fillColor} strokeWidth={2} />
          <line x1={ubX} y1={barY} x2={ubX} y2={barY + BAR_H} stroke={fillColor} strokeWidth={2} />
          {/* Whisker bar */}
          <line
            x1={lbX}
            y1={Y_MID}
            x2={ubX}
            y2={Y_MID}
            stroke={fillColor}
            strokeWidth={1.5}
          />
        </>
      ) : (
        <>
          {/* No MoE — dashed outline + solid center dot */}
          <rect
            x={marginX - 16}
            y={barY}
            width={32}
            height={BAR_H}
            fill="none"
            stroke={fillColor}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            rx={2}
          />
          <circle cx={marginX} cy={Y_MID} r={4} fill={fillColor} />
        </>
      )}

      {/* Margin label */}
      <text x={marginX} y={barY - 4} fontSize={11} fill={fillColor} textAnchor="middle" fontWeight={600}>
        {margin != null ? `${margin > 0 ? "+" : ""}${margin}%` : "—"}
      </text>
    </svg>
  );
}

interface TrendProps {
  trend: M26TrendEntry[];
  ourCandidate: string;
  opponentCandidate: string;
}

export function MarginTrendLine({ trend, ourCandidate: _ourCandidate, opponentCandidate: _opponentCandidate }: TrendProps) {
  if (trend.length < 2) return null;

  const W2 = 420;
  const H2 = 120;
  const PAD = 24;
  const chartW = W2 - PAD * 2;
  const chartH = H2 - 24;
  const ZERO_Y = H2 / 2;

  const allMargins = trend.map((t) => t.margin ?? 0);
  const absMax = Math.max(...allMargins.map(Math.abs), 5);

  const xStep = chartW / (trend.length - 1);

  function marginY(m: number | null): number {
    if (m == null) return ZERO_Y;
    return ZERO_Y - (m / absMax) * (chartH / 2 - 4);
  }

  const points = trend
    .map((t, i) => `${PAD + i * xStep},${marginY(t.margin)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W2} ${H2}`} width="100%" style={{ display: "block", marginTop: 8 }}>
      {/* Zero line */}
      <line x1={PAD} y1={ZERO_Y} x2={W2 - PAD} y2={ZERO_Y} stroke={GRAY_70} strokeWidth={1} strokeDasharray="4 3" />

      {/* Trend line */}
      <polyline points={points} fill="none" stroke={BLUE_40} strokeWidth={1.5} />

      {/* Data points with quality badges */}
      {trend.map((t, i) => {
        const cx = PAD + i * xStep;
        const cy = marginY(t.margin);
        const hasMoe = t.margin_of_error != null;
        return (
          <g key={t.poll_id}>
            <circle cx={cx} cy={cy} r={4} fill={hasMoe ? "#42be65" : "#f1c21b"} />
            <title>
              {t.poll_name}: margin {t.margin != null ? `${t.margin}%` : "—"}
              {hasMoe ? ` ±${t.margin_of_error}%` : " (no MoE — sample size not recorded)"}
            </title>
          </g>
        );
      })}

      {/* Poll name labels at bottom */}
      {trend.map((t, i) => {
        const name = t.poll_name.length > 8 ? t.poll_name.slice(0, 6) + "…" : t.poll_name;
        return (
          <text
            key={t.poll_id}
            x={PAD + i * xStep}
            y={H2 - 4}
            fontSize={9}
            fill={GRAY_50}
            textAnchor="middle"
          >
            {name}
          </text>
        );
      })}
    </svg>
  );
}
