import { HTMLTable, Tag, Button, Classes } from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { Voter, VoterStatus } from "../types";
import { VOTER_STATUS_INTENT, VOTER_STATUS_LABEL } from "../types";

interface Props {
  voters: Voter[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function StatusTag({ status }: { status: VoterStatus }) {
  return (
    <Tag intent={VOTER_STATUS_INTENT[status]} minimal>
      {VOTER_STATUS_LABEL[status]}
    </Tag>
  );
}

export default function VoterListTable({ voters }: Props) {
  const navigate = useNavigate();

  return (
    <HTMLTable
      striped
      interactive
      className={Classes.HTML_TABLE}
      style={{ width: "100%" }}
    >
      <thead>
        <tr>
          <th>Name</th>
          <th style={{ width: 80 }}>Age</th>
          <th style={{ width: 100 }}>Gender</th>
          <th>District</th>
          <th style={{ width: 120 }}>Status</th>
          <th style={{ width: 140 }}>Last Contact</th>
          <th style={{ width: 80 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {voters.map((voter) => (
          <tr
            key={voter.id}
            onClick={() => navigate(`/voters/${voter.id}`)}
            style={{ cursor: "pointer" }}
          >
            <td>
              <strong style={{ fontSize: 13 }}>{voter.full_name}</strong>
            </td>
            <td>{voter.age}</td>
            <td>{voter.gender}</td>
            <td>{voter.district_name}</td>
            <td>
              <StatusTag status={voter.status} />
            </td>
            <td>{formatDate(voter.last_contact)}</td>
            <td>
              <Button
                minimal
                small
                icon="eye-open"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/voters/${voter.id}`);
                }}
                aria-label={`View ${voter.full_name}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
