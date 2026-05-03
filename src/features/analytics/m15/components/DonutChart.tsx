/** Donut chart using SVG stroke-dasharray technique for campaign status breakdown */

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "var(--cds-interactive)",
  PLANNED: "#8d8d8d",
  ON_HOLD: "#f1c21b",
  COMPLETED: "#24a148",
  CANCELLED: "#c6c6c6",
};

const STATUS_ORDER = ["ACTIVE", "PLANNED", "ON_HOLD", "COMPLETED", "CANCELLED"];

interface Segment {
  status: string;
  count: number;
  color: string;
  offset: number;
  dashLength: number;
}

interface Props {
  byStatus: Record<string, number>;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({ byStatus, total, size = 140, strokeWidth = 22 }: Props) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Build segments in order, filtering zeros
  const segments: Segment[] = [];
  let cumulativeOffset = 0;

  STATUS_ORDER.forEach((status) => {
    const count = byStatus[status] ?? 0;
    if (count === 0 || total === 0) return;
    const dashLength = (count / total) * circumference;
    segments.push({
      status,
      count,
      color: STATUS_COLORS[status] ?? "#8d8d8d",
      offset: circumference - cumulativeOffset,
      dashLength,
    });
    cumulativeOffset += dashLength;
  });

  // Catch any statuses not in STATUS_ORDER
  Object.entries(byStatus).forEach(([status, count]) => {
    if (STATUS_ORDER.includes(status) || count === 0 || total === 0) return;
    const dashLength = (count / total) * circumference;
    segments.push({
      status,
      count,
      color: "#8d8d8d",
      offset: circumference - cumulativeOffset,
      dashLength,
    });
    cumulativeOffset += dashLength;
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: "100%", maxWidth: size, display: "block", margin: "0 auto" }}
      aria-label="Campaign status donut chart"
      role="img"
    >
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0e0e0" strokeWidth={strokeWidth} />
      {/* Segments */}
      {segments.map((seg) => (
        <circle
          key={seg.status}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
          strokeDashoffset={seg.offset}
          transform={`rotate(-90, ${cx}, ${cy})`}
          style={{ transition: "stroke-dasharray 0.3s ease" }}
        >
          <title>{seg.status}: {seg.count}</title>
        </circle>
      ))}
    </svg>
  );
}

export { STATUS_COLORS, STATUS_ORDER };
