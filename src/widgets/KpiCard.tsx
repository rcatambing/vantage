import { Icon, Intent } from "@blueprintjs/core";

interface Props {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: string;
  intent?: Intent;
}

export default function KpiCard({ label, value, delta, deltaPositive, icon, intent }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        {icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 0,
            background: "var(--cds-layer-02)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon icon={icon as never} intent={intent} size={14} />
          </div>
        )}
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value">{value}</div>
      {delta && (
        <div className={`kpi-delta ${deltaPositive ? "positive" : "negative"}`}>
          {deltaPositive ? "\u25B2" : "\u25BC"} {delta}
        </div>
      )}
    </div>
  );
}
