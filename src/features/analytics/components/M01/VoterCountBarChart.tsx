import { Spinner, NonIdealState, Tooltip, Classes } from "@blueprintjs/core";
import type { MetricDataRow } from "../../types";

interface Props {
  data: MetricDataRow[];
  loading?: boolean;
  onBarClick?: (districtId: number) => void;
}

export default function VoterCountBarChart({ data, loading, onBarClick }: Props) {
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
        icon="timeline-bar-chart"
        title="No data"
        description="No districts match the current filters."
      />
    );
  }

  const top15 = data.slice(0, 15);
  const max = Math.max(...top15.map((d) => d.registered_count), 1);
  const BarTag = onBarClick ? "button" : "div";

  return (
    <div>
      <div
        style={{ fontSize: 12, fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.32px" }}
        className={Classes.TEXT_MUTED}
      >
        Registered Voters by District
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: 200,
            gap: 4,
            background: "var(--cds-layer-02)",
            padding: "16px 16px 0",
          }}
        >
          {top15.map((d) => {
            const heightPct = (d.registered_count / max) * 100;
            const label = `${d.district_name}: ${new Intl.NumberFormat("en-PH").format(d.registered_count)} registered voters`;
            return (
              <Tooltip key={d.district_id} content={label} hoverOpenDelay={100}>
                <BarTag
                  aria-label={onBarClick ? `${label}. Click to filter.` : label}
                  onClick={() => onBarClick?.(d.district_id)}
                  className="m01-bar"
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    background: "var(--cds-interactive-01, #0f62fe)",
                    borderRadius: 0,
                    border: "none",
                    padding: 0,
                    cursor: onBarClick ? "pointer" : "default",
                    minWidth: 0,
                  }}
                />
              </Tooltip>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            fontSize: 12,
            letterSpacing: "0.32px",
            justifyContent: "space-around",
          }}
          className={Classes.TEXT_MUTED}
        >
          {top15.map((d) => (
            <Tooltip key={d.district_id} content={d.district_name} hoverOpenDelay={200}>
              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {d.district_name}
              </span>
            </Tooltip>
          ))}
        </div>
        {data.length > 15 && (
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, letterSpacing: "0.32px" }}>
            Showing 15 of {data.length} districts
          </span>
        )}
      </div>
    </div>
  );
}
