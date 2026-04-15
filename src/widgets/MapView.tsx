import { Icon, Classes } from "@blueprintjs/core";

export default function MapView() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--cds-layer-02)",
        borderRadius: 0,
        gap: 8,
      }}
    >
      <Icon icon="map" size={48} className={Classes.TEXT_MUTED} />
      <div style={{ fontSize: 13, fontWeight: 500 }}>Geographic Heatmap</div>
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, maxWidth: 240, textAlign: "center" }}>
        Regional voter distribution visualization. Connect a mapping API to activate.
      </div>
      {/* Mock region dots */}
      <svg width="320" height="140" viewBox="0 0 320 140" style={{ marginTop: 8, opacity: 0.5 }}>
        <rect width="320" height="140" rx="0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        {/* Luzon */}
        <circle cx="140" cy="30" r="12" fill="#4589ff" opacity="0.6" />
        <text x="140" y="34" textAnchor="middle" fontSize="8" fill="#fff">NCR</text>
        <circle cx="110" cy="45" r="8" fill="#4589ff" opacity="0.4" />
        <text x="110" y="48" textAnchor="middle" fontSize="6" fill="#fff">R3</text>
        <circle cx="165" cy="50" r="7" fill="#4589ff" opacity="0.35" />
        <text x="165" y="53" textAnchor="middle" fontSize="6" fill="#fff">R4</text>
        {/* Visayas */}
        <circle cx="180" cy="80" r="9" fill="#24a148" opacity="0.5" />
        <text x="180" y="83" textAnchor="middle" fontSize="7" fill="#fff">R7</text>
        <circle cx="150" cy="75" r="6" fill="#24a148" opacity="0.3" />
        <text x="150" y="78" textAnchor="middle" fontSize="6" fill="#fff">R6</text>
        {/* Mindanao */}
        <circle cx="200" cy="110" r="10" fill="#f1c21b" opacity="0.5" />
        <text x="200" y="113" textAnchor="middle" fontSize="7" fill="#fff">R11</text>
        <circle cx="170" cy="115" r="7" fill="#f1c21b" opacity="0.35" />
        <text x="170" y="118" textAnchor="middle" fontSize="6" fill="#fff">R10</text>
      </svg>
    </div>
  );
}
