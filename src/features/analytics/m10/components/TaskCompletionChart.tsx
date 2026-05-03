import { useMemo, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { M10TrendBucket, M10Summary } from "../types";

/* ---------- Layout constants ---------- */
const W = 560;
const H = 220;
const PAD = { top: 12, right: 20, bottom: 36, left: 52 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const COLORS = {
  remaining: "#e0e0e0",
  humanCompleted: "var(--cds-interactive)",
  forceClosed: "#f1c21b",   // Yellow 30
  idealPace: "#6f6f6f",     // Gray 50
};

export interface SeriesVisibility {
  remaining: boolean;
  humanCompleted: boolean;
  forceClosed: boolean;
  idealPace: boolean;
}

interface Props {
  trend: M10TrendBucket[];
  summary: M10Summary;
  includeCancelled: boolean;
  visibility: SeriesVisibility;
  ariaLabel: string;
}

/* ---------- Scale helpers ---------- */

function xScale(i: number, len: number): number {
  if (len <= 1) return PAD.left + PLOT_W / 2;
  return PAD.left + (i / (len - 1)) * PLOT_W;
}

function yScale(count: number, maxY: number): number {
  if (maxY === 0) return PAD.top + PLOT_H;
  return PAD.top + (1 - count / maxY) * PLOT_H;
}

/* ---------- Path builders ---------- */

function buildLinePath(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}

function buildAreaPath(points: { x: number; y: number }[], baseline: number): string {
  if (points.length === 0) return "";
  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x.toFixed(1)} ${baseline.toFixed(1)} L ${first.x.toFixed(1)} ${baseline.toFixed(1)} Z`;
}

/* ---------- Y-axis tick labels ---------- */

function niceYTicks(maxY: number, count = 4): number[] {
  if (maxY === 0) return [0];
  const step = Math.ceil(maxY / count);
  return Array.from({ length: count + 1 }, (_, i) => i * step).filter((v) => v <= maxY + step);
}

function fmtBucketLabel(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function safePct(numerator: number, denominator: number): number | null {
  if (denominator <= 0) {
    return null;
  }
  return Math.round((numerator / denominator) * 10000) / 100;
}

const pctFmt = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const numFmt = new Intl.NumberFormat("en-PH");

/* ---------- Component ---------- */

export default function TaskCompletionChart({
  trend,
  summary,
  includeCancelled,
  visibility,
  ariaLabel,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const cumulativeTrend = useMemo(() => {
    return trend
      .reduce<{
        items: Array<
          M10TrendBucket & {
            cumulative_human: number;
            cumulative_force: number;
            cumulative_created: number;
          }
        >;
        cumulative_human: number;
        cumulative_force: number;
        cumulative_created: number;
      }>((acc, bucket) => {
        const nextHuman = acc.cumulative_human + bucket.completed_human_count;
        const nextForce = acc.cumulative_force + bucket.completed_force_closed_count;
        const nextCreated = acc.cumulative_created + bucket.created_count;

        acc.items.push({
          ...bucket,
          cumulative_human: nextHuman,
          cumulative_force: nextForce,
          cumulative_created: nextCreated,
        });

        return {
          items: acc.items,
          cumulative_human: nextHuman,
          cumulative_force: nextForce,
          cumulative_created: nextCreated,
        };
      }, {
        items: [],
        cumulative_human: 0,
        cumulative_force: 0,
        cumulative_created: 0,
      })
      .items;
  }, [trend]);

  if (trend.length === 0) {
    return (
      <div
        style={{
          height: H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--cds-text-placeholder)",
          fontSize: 13,
          border: "1px dashed var(--cds-border-subtle)",
          borderRadius: 2,
        }}
        role="img"
        aria-label="No trend data available"
      >
        No trend data — adjust filters or date range
      </div>
    );
  }

  const len = cumulativeTrend.length;
  const maxY = summary.total_scope_count > 0 ? summary.total_scope_count : 1;
  const baseline = PAD.top + PLOT_H;

  /* Build point arrays */
  const remainingPts = cumulativeTrend.map((b, i) => ({
    x: xScale(i, len),
    y: yScale(b.remaining_open_count, maxY),
  }));

  const humanPts = cumulativeTrend.map((b, i) => ({
    x: xScale(i, len),
    y: yScale(b.cumulative_human, maxY),
  }));

  const forcePts = cumulativeTrend.map((b, i) => ({
    x: xScale(i, len),
    y: yScale(b.cumulative_force, maxY),
  }));

  /* Ideal pace: from total_scope at bucket[0].x to 0 at bucket[len-1].x */
  const idealStart = { x: xScale(0, len), y: yScale(maxY, maxY) };
  const idealEnd = { x: xScale(len - 1, len), y: yScale(0, maxY) };

  const yTicks = niceYTicks(maxY);

  /* X-axis labels — show at most 6 labels to avoid crowding */
  const xLabelIndices: number[] = [];
  const maxLabels = Math.min(6, len);
  if (maxLabels === 1) {
    xLabelIndices.push(0);
  } else {
    for (let i = 0; i < maxLabels; i++) {
      xLabelIndices.push(Math.round((i / (maxLabels - 1)) * (len - 1)));
    }
  }
  const uniqueXLabelIndices = Array.from(new Set(xLabelIndices)).sort((a, b) => a - b);

  /* Screen-reader table rows */
  const srRows = cumulativeTrend.map((b) => ({
    label: fmtBucketLabel(b.bucket_start),
    remaining: b.remaining_open_count,
    human: b.cumulative_human,
    force: b.cumulative_force,
  }));

  const activeBucket = activeIndex != null ? cumulativeTrend[activeIndex] : null;
  const activeX = activeIndex != null ? xScale(activeIndex, len) : null;

  const bucketWidth = len <= 1 ? PLOT_W : PLOT_W / len;

  function handleHitKeyDown(e: ReactKeyboardEvent<SVGRectElement>, idx: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((current) => {
        if (current == null) {
          return idx;
        }
        return Math.min(current + 1, len - 1);
      });
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((current) => {
        if (current == null) {
          return idx;
        }
        return Math.max(current - 1, 0);
      });
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel}
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = yScale(tick, maxY);
          return (
            <line
              key={tick}
              x1={PAD.left}
              y1={y}
              x2={PAD.left + PLOT_W}
              y2={y}
              stroke="var(--cds-border-subtle)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Remaining area */}
        {visibility.remaining && (
          <path
            d={buildAreaPath(remainingPts, baseline)}
            fill={COLORS.remaining}
            fillOpacity={0.35}
            stroke={COLORS.remaining}
            strokeWidth={1.5}
          />
        )}

        {/* Human completed area */}
        {visibility.humanCompleted && (
          <path
            d={buildAreaPath(humanPts, baseline)}
            fill={COLORS.humanCompleted}
            fillOpacity={0.2}
            stroke={COLORS.humanCompleted}
            strokeWidth={2}
          />
        )}

        {/* Force closed area */}
        {visibility.forceClosed && includeCancelled && (
          <path
            d={buildAreaPath(forcePts, baseline)}
            fill={COLORS.forceClosed}
            fillOpacity={0.25}
            stroke={COLORS.forceClosed}
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
        )}

        {/* Ideal pace line */}
        {visibility.idealPace && (
          <line
            x1={idealStart.x}
            y1={idealStart.y}
            x2={idealEnd.x}
            y2={idealEnd.y}
            stroke={COLORS.idealPace}
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
        )}

        {/* Y-axis ticks + labels */}
        {yTicks.map((tick) => {
          const y = yScale(tick, maxY);
          return (
            <g key={tick}>
              <line
                x1={PAD.left - 4}
                y1={y}
                x2={PAD.left}
                y2={y}
                stroke="var(--cds-border-subtle)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fill="var(--cds-text-secondary)"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {uniqueXLabelIndices.map((idx) => {
          const x = xScale(idx, len);
          return (
            <text
              key={idx}
              x={x}
              y={H - 4}
              textAnchor="middle"
              fontSize={11}
              fill="var(--cds-text-secondary)"
            >
              {fmtBucketLabel(cumulativeTrend[idx].bucket_start)}
            </text>
          );
        })}

        {/* Hover/focus indicator */}
        {activeX != null && (
          <line
            x1={activeX}
            y1={PAD.top}
            x2={activeX}
            y2={baseline}
            stroke="var(--cds-border-strong)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {/* Axes */}
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={baseline}
          stroke="var(--cds-border-strong)"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          y1={baseline}
          x2={PAD.left + PLOT_W}
          y2={baseline}
          stroke="var(--cds-border-strong)"
          strokeWidth={1}
        />

        {/* Bucket interaction hit targets */}
        {cumulativeTrend.map((bucket, idx) => {
          const centerX = xScale(idx, len);
          const left = Math.max(PAD.left, centerX - bucketWidth / 2);
          return (
            <rect
              key={`${bucket.bucket_start}-${idx}`}
              x={left}
              y={PAD.top}
              width={bucketWidth}
              height={PLOT_H}
              fill="transparent"
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(idx)}
              onBlur={() => setActiveIndex(null)}
              onKeyDown={(e) => handleHitKeyDown(e, idx)}
              aria-label={
                `${fmtBucketLabel(bucket.bucket_start)}. ` +
                `Remaining ${bucket.remaining_open_count}. ` +
                `Human completed ${bucket.cumulative_human}. ` +
                `Force closed ${bucket.cumulative_force}.`
              }
            />
          );
        })}
      </svg>

      {activeBucket && activeX != null && (
        <div
          role="tooltip"
          aria-live="polite"
          style={{
            position: "absolute",
            top: 8,
            left: `clamp(8px, calc(${((activeX / W) * 100).toFixed(2)}% - 80px), calc(100% - 220px))`,
            minWidth: 220,
            padding: "8px 10px",
            borderRadius: 2,
            background: "var(--cds-layer-02)",
            border: "1px solid var(--cds-border-subtle)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
            fontSize: 11,
            display: "grid",
            gap: 4,
            pointerEvents: "none",
          }}
        >
          <div style={{ color: "var(--cds-text-secondary)", fontSize: 11 }}>
            {fmtBucketLabel(activeBucket.bucket_start)} - {fmtBucketLabel(activeBucket.bucket_end)}
          </div>
          <div>Remaining: {numFmt.format(activeBucket.remaining_open_count)}</div>
          <div>Human completed: {numFmt.format(activeBucket.cumulative_human)}</div>
          {includeCancelled && (
            <div>Force-closed: {numFmt.format(activeBucket.cumulative_force)}</div>
          )}
          <div>Total scope: {numFmt.format(summary.total_scope_count)}</div>
          <div>
            Headline: {activeBucket.headline_completion_rate != null
              ? `${pctFmt.format(activeBucket.headline_completion_rate)}%`
              : "-"}
          </div>
          <div>
            Human rate: {safePct(activeBucket.cumulative_human, Math.max(summary.total_scope_count, 1)) != null
              ? `${pctFmt.format(safePct(activeBucket.cumulative_human, Math.max(summary.total_scope_count, 1)) as number)}%`
              : "-"}
          </div>
          {includeCancelled && (
            <div>
              Force-closure rate: {safePct(activeBucket.cumulative_force, Math.max(summary.total_scope_count, 1)) != null
                ? `${pctFmt.format(safePct(activeBucket.cumulative_force, Math.max(summary.total_scope_count, 1)) as number)}%`
                : "-"}
            </div>
          )}
        </div>
      )}

      {/* Screen-reader fallback table */}
      <table
        aria-label="Task completion trend data"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
          margin: -1,
          padding: 0,
        }}
      >
        <thead>
          <tr>
            <th>Bucket</th>
            <th>Remaining</th>
            <th>Human Completed</th>
            <th>Force Closed</th>
          </tr>
        </thead>
        <tbody>
          {srRows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.remaining}</td>
              <td>{row.human}</td>
              <td>{row.force}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
