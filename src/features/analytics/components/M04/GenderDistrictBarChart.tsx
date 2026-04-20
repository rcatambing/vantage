import { Spinner, NonIdealState, Tooltip, Classes } from "@blueprintjs/core";
import type { MetricM04DistrictRow } from "../../types";
import { GENDER_COLORS, GENDER_LABELS, fmt } from "./genderEncoding";

interface Props {
  data: MetricM04DistrictRow[];
  loading?: boolean;
}

export default function GenderDistrictBarChart({ data, loading }: Props) {
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
        icon="horizontal-bar-chart"
        title="No data"
        description="No district-level gender data matches the current filters."
      />
    );
  }

  // Sort districts by female share descending
  const sorted = [...data].sort((a, b) => {
    const femaleShareA = a.genders.find((g) => g.gender === "FEMALE")?.percentage ?? 0;
    const femaleShareB = b.genders.find((g) => g.gender === "FEMALE")?.percentage ?? 0;
    return femaleShareB - femaleShareA;
  });

  const ariaDescription = sorted
    .map((d) => {
      const parts = d.genders.map((g) => `${GENDER_LABELS[g.gender] ?? g.gender}: ${g.percentage.toFixed(1)}%`);
      return `${d.district_name}: ${parts.join(", ")}`;
    })
    .join(". ");

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Gender Ratio by District
      </div>
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginBottom: 8 }}>
        Sorted by female share, highest first
      </div>

      <div
        role="img"
        aria-label={`Gender ratio by district bar chart. ${ariaDescription}`}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {sorted.map((district) => {
          const distTotal = district.genders.reduce((sum, g) => sum + g.count, 0);
          return (
            <div key={district.district_id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* District name */}
              <div
                style={{
                  maxWidth: 140,
                  fontSize: 12,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  textAlign: "right",
                }}
                title={district.district_name}
              >
                {district.district_name}
              </div>

              {/* Stacked horizontal bar */}
              <div
                aria-hidden
                style={{
                  flex: 1,
                  display: "flex",
                  height: 24,
                  background: "var(--cds-layer-02)",
                  overflow: "hidden",
                }}
              >
                {district.genders
                  .filter((g) => g.count > 0)
                  .map((g) => {
                    // Use locally-computed percentage for both width and label so they always agree
                    const widthPct = distTotal > 0 ? (g.count / distTotal) * 100 : 0;
                    const color = GENDER_COLORS[g.gender] ?? "var(--cds-interactive-01, #0f62fe)";
                    const label = `${GENDER_LABELS[g.gender] ?? g.gender}: ${fmt.format(g.count)} (${widthPct.toFixed(1)}%)`;
                    return (
                      <Tooltip key={g.gender} content={label} hoverOpenDelay={100} openOnTargetFocus={false}>
                        <div
                          style={{
                            width: `${widthPct}%`,
                            height: "100%",
                            background: color,
                            minWidth: widthPct > 0 ? 2 : 0,
                          }}
                        />
                      </Tooltip>
                    );
                  })}
              </div>

              {/* Count label */}
              <span
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 12, width: 60, textAlign: "right", flexShrink: 0 }}
              >
                {fmt.format(distTotal)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend — only show genders that actually appear in the data */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {Array.from(new Set(sorted.flatMap((d) => d.genders.map((g) => g.gender)))).map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, background: GENDER_COLORS[key] ?? "var(--cds-interactive-01, #0f62fe)", borderRadius: 2 }} />
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
              {GENDER_LABELS[key] ?? key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
