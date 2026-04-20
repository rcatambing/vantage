import { Spinner, NonIdealState, Tooltip, Classes } from "@blueprintjs/core";
import type { MetricM02DataRow } from "../../types";

interface Props {
  data: MetricM02DataRow[];
  loading?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function interpolateBlue(ratio: number): string {
  // Blue 10 (#edf5ff) -> Blue 60 (#0f62fe)
  const clamped = clamp(ratio, 0, 1);
  const r = Math.round(237 + (15 - 237) * clamped);
  const g = Math.round(245 + (98 - 245) * clamped);
  const b = Math.round(255 + (254 - 255) * clamped);
  return `rgb(${r},${g},${b})`;
}

export default function RegistrationRateHeatmap({ data, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Spinner size={32} />
      </div>
    );
  }

  const rows = data.slice(0, 30);

  if (rows.length === 0) {
    return (
      <NonIdealState
        icon="heat-grid"
        title="No data"
        description="No districts match the current filters."
      />
    );
  }

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Registration Saturation by District
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>0%</span>
        <div
          aria-hidden
          style={{
            height: 8,
            flex: 1,
            borderRadius: 0,
            background: "linear-gradient(90deg, #edf5ff 0%, #0f62fe 100%)",
          }}
        />
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>100%</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 1,
        }}
      >
        {rows.map((row) => {
          const ratio = clamp((row.rate ?? 0) / 100, 0, 1);
          const background = interpolateBlue(ratio);
          const textColor = ratio > 0.85 ? "#ffffff" : "#161616";
          const tooltipText = `${row.district_name}: ${new Intl.NumberFormat("en-PH").format(row.registered)} / ${new Intl.NumberFormat("en-PH").format(row.population)} (${row.rate.toFixed(1)}%)`;

          return (
            <Tooltip key={row.district_id} content={tooltipText} hoverOpenDelay={100}>
              <div
                tabIndex={0}
                role="img"
                aria-label={tooltipText}
                style={{
                  background,
                  padding: "8px 12px",
                  minHeight: 72,
                  borderRadius: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 500, color: textColor, lineHeight: 1.3 }}>
                  {row.district_name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>
                  {row.rate.toFixed(1)}%
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>

      {data.length > rows.length && (
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, display: "inline-block", marginTop: 10 }}>
          Showing {rows.length} of {data.length} districts
        </span>
      )}
    </div>
  );
}
