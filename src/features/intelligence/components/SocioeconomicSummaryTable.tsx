import { HTMLTable, Classes } from "@blueprintjs/core";
import type { SocioeconomicSummaryRow } from "../types";

interface Props {
  rows: SocioeconomicSummaryRow[];
}

function fmt(n: number | null): string {
  return n != null ? n.toFixed(2) : "—";
}

export default function SocioeconomicSummaryTable({ rows }: Props) {
  return (
    <HTMLTable striped interactive bordered style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          <th>District</th>
          <th>City Class</th>
          <th>Income Bracket</th>
          <th>Voter Count</th>
          <th>Avg CWSS</th>
          <th>Avg Freshness</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.district_id}-${r.city_class ?? "null"}-${r.income_bracket ?? "null"}`}>
            <td>
              <code className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                {r.district_id}
              </code>
            </td>
            <td>{r.city_class ?? "—"}</td>
            <td>{r.income_bracket ?? "—"}</td>
            <td>{r.voter_count.toLocaleString()}</td>
            <td>{fmt(r.avg_cwss)}</td>
            <td>{fmt(r.avg_freshness_index)}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
