import { Classes } from "@blueprintjs/core";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: BarData[];
  maxValue?: number;
}

const COLORS = ["#4589ff", "#24a148", "#f1c21b", "#da1e28", "#a56eff", "#08bdba"];

export default function BarChart({ data, maxValue }: Props) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="mini-bar-chart" style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div
            key={d.label}
            className="bar"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: d.color ?? COLORS[i % COLORS.length],
            }}
            title={`${d.label}: ${d.value}`}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          marginTop: 8,
          fontSize: 10,
          justifyContent: "space-around",
        }}
        className={Classes.TEXT_MUTED}
      >
        {data.map((d) => (
          <span key={d.label} style={{ textAlign: "center", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
