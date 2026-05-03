import { STATUS_COLORS, STATUS_ORDER } from "./DonutChart";

interface Props {
  byStatus: Record<string, number>;
}

export default function DonutLegend({ byStatus }: Props) {
  const allStatuses = [
    ...STATUS_ORDER,
    ...Object.keys(byStatus).filter((s) => !STATUS_ORDER.includes(s)),
  ].filter((s) => (byStatus[s] ?? 0) > 0);

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      aria-label="Campaign status legend"
    >
      {allStatuses.map((status) => {
        const color = STATUS_COLORS[status] ?? "#8d8d8d";
        const isCancelled = status === "CANCELLED";
        return (
          <li
            key={status}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: color,
                flexShrink: 0,
                border: isCancelled ? "1px solid #8d8d8d" : "none",
              }}
              aria-hidden="true"
            />
            <span style={{ textTransform: "capitalize", color: "var(--cds-text-secondary)" }}>
              {status.replace("_", " ")}
            </span>
            <span style={{ marginLeft: "auto", fontWeight: 500 }}>
              {byStatus[status] ?? 0}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
