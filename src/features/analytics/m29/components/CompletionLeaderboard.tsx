import { HTMLTable } from "@blueprintjs/core";
import type { M29StaffBreakdown } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  data: M29StaffBreakdown[];
}

export default function CompletionLeaderboard({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.rate - a.rate);

  return (
    <div style={{ padding: "8px 16px" }}>
      <HTMLTable compact striped style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ color: GRAY_50, fontWeight: 600 }}>Staff</th>
            <th style={{ color: GRAY_50, fontWeight: 600, textAlign: "right" }}>Completed</th>
            <th style={{ color: GRAY_50, fontWeight: 600, textAlign: "right" }}>Total</th>
            <th style={{ color: GRAY_50, fontWeight: 600, textAlign: "right" }}>Rate</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.staff_id}>
              <td>{s.staff_name}</td>
              <td style={{ textAlign: "right" }}>{s.completed}</td>
              <td style={{ textAlign: "right" }}>{s.total}</td>
              <td style={{ textAlign: "right", color: BLUE_40, fontWeight: 600 }}>
                {s.rate.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
