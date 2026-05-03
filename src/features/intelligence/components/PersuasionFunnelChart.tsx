import { HTMLTable, Classes, Tag, Intent } from "@blueprintjs/core";
import type { PersuasionFunnelRow, PersuasionStage } from "../types";

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
  rows: PersuasionFunnelRow[];
}

export default function PersuasionFunnelChart({ rows }: Props) {
  const total = rows.reduce((sum, r) => sum + r.voters_in_stage, 0);

  return (
    <div>
      <HTMLTable striped bordered style={{ width: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Voters</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.persuasion_stage}>
              <td>
                <Tag minimal intent={STAGE_INTENT[r.persuasion_stage]} style={{ fontSize: 11 }}>
                  {STAGE_LABEL[r.persuasion_stage]}
                </Tag>
              </td>
              <td>{r.voters_in_stage.toLocaleString()}</td>
              <td>{r.stage_pct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>

      {/* Simple bar chart */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r) => {
          const pct = total > 0 ? (r.voters_in_stage / total) * 100 : 0;
          return (
            <div key={r.persuasion_stage} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 120, fontSize: 11, textAlign: "right" }}>
                {STAGE_LABEL[r.persuasion_stage]}
              </div>
              <div style={{ flex: 1, background: "var(--bp5-dark-gray5)", borderRadius: 4, height: 20 }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: 4,
                    background:
                      r.persuasion_stage === "STRONG_SUPPORTER"
                        ? "#2ca02c"
                        : r.persuasion_stage === "LEAN_SUPPORTER"
                        ? "#1f77b4"
                        : r.persuasion_stage === "PERSUADABLE"
                        ? "#ff7f0e"
                        : "#d62728",
                  }}
                />
              </div>
              <div style={{ width: 50, fontSize: 11 }}>{pct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
