import { HTMLTable, Classes } from "@blueprintjs/core";
import type { DistrictReadinessRow } from "../types";

interface Props {
  rows: DistrictReadinessRow[];
}

function scoreColor(score: number): string {
  if (score >= 80) return "#2ca02c";
  if (score >= 50) return "#ff7f0e";
  return "#d62728";
}

function scoreBg(score: number): string {
  if (score >= 80) return "rgba(44, 160, 44, 0.15)";
  if (score >= 50) return "rgba(255, 127, 14, 0.15)";
  return "rgba(214, 39, 40, 0.15)";
}

function pctCell(v: number): React.ReactElement {
  const color = v >= 80 ? "#2ca02c" : v >= 50 ? "#ff7f0e" : "#d62728";
  return <span style={{ color, fontWeight: 600 }}>{v.toFixed(1)}%</span>;
}

export default function DistrictReadinessHeatmap({ rows }: Props) {
  return (
    <HTMLTable striped interactive bordered style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          <th>District</th>
          <th>Registered Voters</th>
          <th>Signal Coverage</th>
          <th>Affiliation</th>
          <th>Leader Presence</th>
          <th>Poll Participation</th>
          <th>Readiness Score</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.district_id}>
            <td>
              <code className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                {r.district_id}
              </code>
            </td>
            <td>{r.registered_voters.toLocaleString()}</td>
            <td>{pctCell(r.signal_coverage_pct)}</td>
            <td>{pctCell(r.affiliation_coverage_pct)}</td>
            <td>{pctCell(r.leader_presence_pct)}</td>
            <td>{pctCell(r.poll_participation_coverage_pct)}</td>
            <td
              style={{
                background: scoreBg(r.readiness_score),
                color: scoreColor(r.readiness_score),
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {r.readiness_score.toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
