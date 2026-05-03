/** Semicircular gauge chart for unfavorability rate (red) */

const fmtNum = new Intl.NumberFormat("en-PH");

interface Props {
  rate: number | null;
  unfavorableCount: number;
  eligibleCount: number;
}

export default function UnfavorabilityGauge({ rate, unfavorableCount, eligibleCount }: Props) {
  const r = 78;
  const cx = 100;
  const cy = 100;
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const arcLength = Math.PI * r;
  const fillDash = rate != null ? (rate / 100) * arcLength : 0;
  const color = "#E53935";

  return (
    <svg
      viewBox="0 0 200 114"
      width="100%"
      style={{ maxWidth: 240, display: "block", margin: "0 auto" }}
      aria-label={`Unfavorability gauge: ${rate?.toFixed(1) ?? "N/A"}%`}
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
        {`${fmtNum.format(unfavorableCount)} / ${fmtNum.format(eligibleCount)} eligible`}
      </text>
    </svg>
  );
}
