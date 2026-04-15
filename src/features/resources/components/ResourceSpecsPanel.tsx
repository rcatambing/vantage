import { Card, Elevation, NonIdealState } from "@blueprintjs/core";

interface Props {
  specifications: Record<string, unknown>;
}

function toTitleCase(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function ResourceSpecsPanel({ specifications }: Props) {
  const entries = Object.entries(specifications);

  if (entries.length === 0) {
    return (
      <NonIdealState
        icon="properties"
        title="No specifications"
        description="No specifications have been recorded for this resource."
      />
    );
  }

  return (
    <Card elevation={Elevation.ZERO} style={{ padding: 0 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {entries.map(([key, value]) => (
            <tr
              key={key}
              style={{ borderBottom: "1px solid var(--cds-border-subtle, rgba(255,255,255,0.1))" }}
            >
              <td
                style={{
                  padding: "6px 12px",
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--cds-text-secondary, #525252)",
                  width: "40%",
                  verticalAlign: "top",
                }}
              >
                {toTitleCase(key)}
              </td>
              <td style={{ padding: "6px 12px", verticalAlign: "top" }}>
                {formatValue(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
