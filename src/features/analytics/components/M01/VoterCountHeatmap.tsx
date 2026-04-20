import { Spinner, NonIdealState, Classes } from "@blueprintjs/core";
import type { MetricDataRow } from "../../types";

interface Props {
  data: MetricDataRow[];
  loading?: boolean;
}

function interpolateBlue(ratio: number): string {
  // Blue 10 (#edf5ff) → Blue 80 (#001d6c)
  const r = Math.round(237 + (0 - 237) * ratio);
  const g = Math.round(245 + (29 - 245) * ratio);
  const b = Math.round(255 + (108 - 255) * ratio);
  return `rgb(${r},${g},${b})`;
}

export default function VoterCountHeatmap({ data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Spinner size={32} />
      </div>
    );
  }

  const top20 = data.slice(0, 20);

  if (top20.length === 0) {
    return (
      <NonIdealState
        icon="heat-grid"
        title="No data"
        description="No districts match the current filters."
      />
    );
  }

  const maxCount = Math.max(...top20.map((d) => d.registered_count), 1);

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Geographic Distribution
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 1,
        }}
      >
        {top20.map((d) => {
          const ratio = d.registered_count / maxCount;
          const bg = interpolateBlue(ratio);
          const textColor = ratio > 0.5 ? "#ffffff" : "#161616";

          return (
            <div
              key={d.district_id}
              style={{
                background: bg,
                padding: "8px 12px",
                borderRadius: 0,
                minHeight: 64,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ fontSize: 12, fontWeight: 500, color: textColor, lineHeight: 1.3, letterSpacing: "0.32px" }}
              >
                {d.district_name}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: textColor, marginTop: 4, letterSpacing: "0.16px" }}>
                {new Intl.NumberFormat("en-PH").format(d.registered_count)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
