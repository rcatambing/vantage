interface Props {
  count?: number;
}

/**
 * Skeleton loading state for metric panels.
 * Renders rectangular blocks matching common panel dimensions.
 * Uses div-based skeleton placeholders with aria-busy for accessibility.
 */
export default function MetricPanelSkeleton({ count = 6 }: Props) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading dashboard data"
      role="status"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
        padding: 16,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minHeight: 140,
          }}
        >
          <div style={{ width: "60%", height: 16, background: "var(--cds-border-subtle, #e0e0e0)", borderRadius: 4 }} />
          <div style={{ width: "40%", height: 32, background: "var(--cds-border-subtle, #e0e0e0)", borderRadius: 4 }} />
          <div style={{ width: "80%", height: 12, background: "var(--cds-border-subtle, #e0e0e0)", borderRadius: 4 }} />
          <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
            <div style={{ width: "30%", height: 20, background: "var(--cds-border-subtle, #e0e0e0)", borderRadius: 4 }} />
            <div style={{ width: "30%", height: 20, background: "var(--cds-border-subtle, #e0e0e0)", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
