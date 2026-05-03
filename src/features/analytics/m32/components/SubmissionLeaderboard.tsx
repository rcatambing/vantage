import { HTMLTable } from "@blueprintjs/core";
import type { M32StaffBreakdown } from "../types";

const BLUE_40 = "#78a9ff";
const GRAY_50 = "#8d8d8d";

interface Props {
  data: M32StaffBreakdown[];
}

export default function SubmissionLeaderboard({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.submission_count - a.submission_count);

  return (
    <div style={{ padding: "8px 16px" }}>
      <HTMLTable compact striped style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ color: GRAY_50, fontWeight: 600 }}>Staff</th>
            <th style={{ color: GRAY_50, fontWeight: 600, textAlign: "right" }}>Submissions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s) => (
            <tr key={s.staff_id}>
              <td>{s.staff_name}</td>
              <td style={{ textAlign: "right", color: BLUE_40, fontWeight: 600 }}>
                {s.submission_count}
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </div>
  );
}
