import { HTMLTable, Classes, Tag, Intent } from "@blueprintjs/core";
import type { VoterCompositeRow, PersuasionStage } from "../types";

const STAGE_INTENT: Record<PersuasionStage, Intent> = {
  STRONG_SUPPORTER: Intent.SUCCESS,
  LEAN_SUPPORTER: Intent.PRIMARY,
  PERSUADABLE: Intent.WARNING,
  LEAN_OPPONENT: Intent.DANGER,
  STRONG_OPPONENT: Intent.DANGER,
  UNKNOWN: Intent.NONE,
};

const STAGE_LABEL: Record<PersuasionStage, string> = {
  STRONG_SUPPORTER: "Strong Supporter",
  LEAN_SUPPORTER: "Lean Supporter",
  PERSUADABLE: "Persuadable",
  LEAN_OPPONENT: "Lean Opponent",
  STRONG_OPPONENT: "Strong Opponent",
  UNKNOWN: "Unknown",
};

interface Props {
  rows: VoterCompositeRow[];
}

function fmt(n: number): string {
  return n.toFixed(2);
}

export default function VoterCompositeTable({ rows }: Props) {
  return (
    <HTMLTable striped interactive bordered style={{ width: "100%", fontSize: 12 }}>
      <thead>
        <tr>
          <th>Voter ID</th>
          <th>District</th>
          <th>CWSS</th>
          <th>Support</th>
          <th>Freshness</th>
          <th>Stage</th>
          <th>Confidence</th>
          <th>Contacts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.voter_id}>
            <td>
              <code className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                {r.voter_id}
              </code>
            </td>
            <td>{r.district_id ?? "—"}</td>
            <td>{fmt(r.cwss)}</td>
            <td>{fmt(r.support_index)}</td>
            <td>{fmt(r.freshness_index)}</td>
            <td>
              <Tag minimal intent={STAGE_INTENT[r.persuasion_stage]} style={{ fontSize: 11 }}>
                {STAGE_LABEL[r.persuasion_stage]}
              </Tag>
            </td>
            <td>{r.stage_confidence != null ? fmt(r.stage_confidence) : "—"}</td>
            <td>{r.contacts_30d}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
