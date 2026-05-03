import type { M44EventBreakdown } from "../types";

const BLUE_30 = "#82cfff";
const BLUE_60 = "#0f62fe";
const GRAY_50 = "#8d8d8d";

interface Props {
  events: M44EventBreakdown[];
}

const W = 520;
const PAD_LEFT = 160;
const PAD_RIGHT = 80;
const PAD_TOP = 8;
const BAR_H = 10;
const ROW_H = 32;
const GAP = 2;

export default function EventAttendanceChart({ events }: Props) {
  if (!events.length) return null;

  const maxVal = Math.max(...events.map((e) => Math.max(e.expected_attendance, e.actual_attendance)), 1);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const totalH = PAD_TOP + events.length * ROW_H;

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Event attendance expected vs actual">
      {events.map((e, i) => {
        const y = PAD_TOP + i * ROW_H;
        const expectedW = Math.max(2, (e.expected_attendance / maxVal) * chartW);
        const actualW = Math.max(2, (e.actual_attendance / maxVal) * chartW);
        const label = e.title.length > 20 ? e.title.slice(0, 18) + "…" : e.title;

        return (
          <g key={e.activity_id}>
            {/* Expected bar */}
            <rect x={PAD_LEFT} y={y + 6} width={expectedW} height={BAR_H} fill={BLUE_30} rx={2} />
            {/* Actual bar */}
            <rect x={PAD_LEFT} y={y + 6 + BAR_H + GAP} width={actualW} height={BAR_H} fill={BLUE_60} rx={2} />
            {/* Label */}
            <text x={PAD_LEFT - 6} y={y + 20} textAnchor="end" fontSize={11} fill={GRAY_50}>
              {label}
            </text>
            {/* Values */}
            <text x={PAD_LEFT + chartW + 4} y={y + 14} fontSize={10} fill={BLUE_30}>
              Exp: {e.expected_attendance}
            </text>
            <text x={PAD_LEFT + chartW + 4} y={y + 26} fontSize={10} fill={BLUE_60} fontWeight={500}>
              Act: {e.actual_attendance} ({e.fulfillment_display})
            </text>
          </g>
        );
      })}
    </svg>
  );
}
