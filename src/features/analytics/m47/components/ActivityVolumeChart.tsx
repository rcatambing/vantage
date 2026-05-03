import type { M47TimelineEntry } from "../types";

const BLUE_60 = "#0f62fe";
const BLUE_30 = "#82cfff";
const GRAY_50 = "#8d8d8d";
const GRAY_80 = "#393939";

interface Props {
  timeline: M47TimelineEntry[];
}

const W = 460;
const PAD_LEFT = 50;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;
const BAR_W = 16;

export default function ActivityVolumeChart({ timeline }: Props) {
  if (!timeline.length) return null;

  const maxVal = Math.max(...timeline.map((t) => t.total), 1);
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = 160;
  const totalH = PAD_TOP + chartH + PAD_BOTTOM;
  const step = chartW / Math.max(timeline.length, 1);

  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{ display: "block" }} aria-label="Feed activity volume over time">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PAD_TOP + chartH * (1 - pct);
        return (
          <line key={pct} x1={PAD_LEFT} y1={y} x2={PAD_LEFT + chartW} y2={y} stroke={GRAY_80} strokeWidth={0.5} />
        );
      })}

      {/* Stacked bars */}
      {timeline.map((t, i) => {
        const x = PAD_LEFT + i * step + (step - BAR_W) / 2;
        const postH = (t.posts / maxVal) * chartH;
        const commentH = (t.comments / maxVal) * chartH;
        const yPosts = PAD_TOP + chartH - postH;
        const yComments = yPosts - commentH;

        return (
          <g key={t.period}>
            <rect x={x} y={yComments} width={BAR_W} height={commentH} fill={BLUE_30} rx={2} />
            <rect x={x} y={yPosts} width={BAR_W} height={postH} fill={BLUE_60} rx={2} />
            <text x={x + BAR_W / 2} y={PAD_TOP + chartH + 14} textAnchor="middle" fontSize={9} fill={GRAY_50}>
              {t.period.slice(5, 10)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
