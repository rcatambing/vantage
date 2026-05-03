interface Props {
  /** 0–100 */
  progress: number;
  /** outer diameter in px */
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
}

export default function SemicircularGauge({
  progress,
  size = 160,
  strokeWidth = 14,
  color = "var(--cds-interactive)",
  trackColor = "#e0e0e0",
  label,
}: Props) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // The arc spans 180° from 180° to 0° (bottom-left to bottom-right via top)
  // Circumference of full circle; we only use half
  const circumference = Math.PI * r; // half circle arc length
  const dashOffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const viewBox = `0 0 ${size} ${size / 2 + strokeWidth / 2 + 4}`;

  return (
    <svg
      viewBox={viewBox}
      aria-label={`Milestone progress: ${progress.toFixed(1)}%`}
      role="img"
      style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}
    >
      {/* Track arc */}
      <path
        d={`M ${strokeWidth / 2},${cy} a ${r},${r} 0 0 1 ${size - strokeWidth},0`}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Progress arc using stroke-dasharray on a circle, clipped to top half */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${Math.PI * 2 * r}`}
        strokeDashoffset={dashOffset}
        transform={`rotate(-180, ${cx}, ${cy})`}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
      {/* Percentage label */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="auto"
        style={{ fontSize: 22, fontWeight: 300, fill: "var(--cds-text-primary)" }}
      >
        {progress.toFixed(1)}%
      </text>
      {label && (
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="hanging"
          style={{ fontSize: 10, textTransform: "uppercase", fill: "var(--cds-text-secondary)" }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
