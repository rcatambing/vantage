/** Semicircular gauge chart for favorability rate (green) */

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  rate: number | null;
  favorableCount: number;
  eligibleCount: number;
}

export default function FavorabilityGauge({ rate, favorableCount, eligibleCount }: Props) {
  const r = 78;
  const cx = 100;
  const cy = 100;
  // Arc from left point to right point, clockwise through the top
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const arcLength = Math.PI * r;
  const fillDash = rate != null ? (rate / 100) * arcLength : 0;
  const color = "#4CAF50";

  return (
    <svg
      viewBox="0 0 200 114"
      width="100%"
      style={{ maxWidth: 240, display: "block", margin: "0 auto" }}
      aria-label={`Favorability gauge: ${rate?.toFixed(1) ?? "N/A"}%`}
      role="img"
    >
      {/* Background track */}
      <path
        d={arcPath}
        fill="none"
        stroke="#e0e0e0"
        strokeWidth={16}
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={arcPath}
        fill="none"
        stroke={color}
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={`${fillDash} ${arcLength}`}
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
      {/* Center rate label */}
      <text
        x={cx}
        y={56}
        textAnchor="middle"
        fontSize={32}
        fontWeight={700}
        fill={color}
      >
        {rate != null ? `${rate.toFixed(1)}%` : "—"}
      </text>
      {/* Subtitle: count / eligible */}
      <text
        x={cx}
        y={78}
        textAnchor="middle"
        fontSize={11}
        fill="#888888"
      >
        {`${fmtNum.format(favorableCount)} / ${fmtNum.format(eligibleCount)} eligible`}
      </text>
    </svg>
  );
}
