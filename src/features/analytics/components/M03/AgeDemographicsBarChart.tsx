import { Spinner, NonIdealState, Tooltip, Classes } from "@blueprintjs/core";
import type { MetricM03AgeBracketRow } from "../../types";

interface Props {
  data: MetricM03AgeBracketRow[];
  loading?: boolean;
}

const BRACKET_COLORS: Record<string, string> = {
  "18-24": "#78a9ff",
  "25-34": "#3ddbd9",
  "35-44": "#6fdc8c",
  "45-54": "#ff832b",
  "55-64": "#ff8389",
  "65+": "#d4bbff",
};

const fmt = new Intl.NumberFormat("en-PH");

export default function AgeDemographicsBarChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <NonIdealState
        icon="grouped-bar-chart"
        title="No data"
        description="No age demographics match the current filters."
      />
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Age Distribution
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          role="img"
          aria-label={`Age Distribution bar chart. ${data.map((d) => `${d.age_bracket}: ${fmt.format(d.count)} voters (${d.percentage.toFixed(1)}%)`).join(". ")}`}
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: 220,
            gap: 8,
            background: "var(--cds-layer-02)",
            padding: "16px 16px 0px",
          }}
        >
          {data.map((d) => {
            const heightPct = (d.count / max) * 100;
            const color = BRACKET_COLORS[d.age_bracket] ?? "var(--cds-interactive-01, #0f62fe)";
            const label = `${d.age_bracket}: ${fmt.format(d.count)} voters (${d.percentage.toFixed(1)}%)`;
            return (
              <Tooltip key={d.age_bracket} content={label} hoverOpenDelay={100}>
                <div
                  aria-hidden
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    minHeight: 2,
                    background: color,
                    borderRadius: 0,
                    minWidth: 0,
                  }}
                />
              </Tooltip>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
          {data.map((d) => (
            <div
              key={d.age_bracket}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 0 }}
            >
              <span
                className={Classes.TEXT_MUTED}
                style={{ letterSpacing: "0.32px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}
              >
                {d.age_bracket}
              </span>
              <span
                className={Classes.TEXT_MUTED}
                style={{ letterSpacing: "0.32px", textAlign: "center", fontSize: 11 }}
              >
                {fmt.format(d.count)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
