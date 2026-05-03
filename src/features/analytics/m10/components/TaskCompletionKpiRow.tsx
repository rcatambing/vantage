import { Classes } from "@blueprintjs/core";
import type { M10Summary } from "../types";

const fmtPct = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const fmtNum = new Intl.NumberFormat("en-PH");

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function KpiCard({ label, value, sub, color }: KpiCardProps) {
  return (
    <div
      style={{
        minWidth: 120,
        padding: "8px 16px",
        background: "var(--cds-layer-02)",
        borderRadius: 2,
        borderLeft: color ? `3px solid ${color}` : undefined,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1, color: color ?? "inherit" }}>
        {value}
      </div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}
           className={Classes.TEXT_MUTED}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, marginTop: 2 }} className={Classes.TEXT_MUTED}>
          {sub}
        </div>
      )}
    </div>
  );
}

interface Props {
  summary: M10Summary;
  includeCancelled: boolean;
}

export default function TaskCompletionKpiRow({ summary, includeCancelled }: Props) {
  const headlineRate =
    summary.headline_completion_rate != null
      ? `${fmtPct.format(summary.headline_completion_rate)}%`
      : "—";

  const humanRate =
    summary.human_completion_rate != null
      ? `${fmtPct.format(summary.human_completion_rate)}%`
      : "—";

  return (
    <div
      role="region"
      aria-label="Task completion KPIs"
      style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
    >
      <KpiCard
        label={includeCancelled ? "Headline Completion" : "Human Completion Rate"}
        value={headlineRate}
        sub={`${fmtNum.format(summary.total_scope_count)} total tasks`}
        color="var(--cds-interactive)"
      />
      <KpiCard
        label="Human Completed"
        value={fmtNum.format(summary.human_completed_count)}
        sub={`${humanRate} of scope`}
        color="#24a148"
      />
      <KpiCard
        label="Force Closed"
        value={fmtNum.format(summary.force_closed_count)}
        sub={includeCancelled
          ? summary.force_closure_rate != null
            ? `${fmtPct.format(summary.force_closure_rate)}% of scope`
            : undefined
          : "Excluded from headline rate"}
        color="#f1c21b"
      />
      <KpiCard
        label="Remaining Open"
        value={fmtNum.format(summary.remaining_open_count)}
        color="var(--cds-layer-03)"
      />
    </div>
  );
}
