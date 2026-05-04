import { useState } from "react";
import {
  Button,
  Spinner,
  NonIdealState,
  Tag,
  HTMLTable,
  Classes,
} from "@blueprintjs/core";
import type { Participant } from "../types";
import { PARTICIPANT_STATUS_INTENT, PARTICIPANT_STATUS_LABEL } from "../types";
import ParticipantImportDialog from "./ParticipantImportDialog";

interface Props {
  pollId: string;
  participants: Participant[];
  loading: boolean;
  onMutate: () => void;
}

export default function ParticipantListTable({
  pollId,
  participants,
  loading,
  onMutate,
}: Props) {
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h4 className="bp5-heading" style={{ margin: 0 }}>Participants</h4>
        <Button icon="import" text="Import" onClick={() => setImportOpen(true)} />
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <Spinner size={20} />
        </div>
      )}

      {!loading && participants.length === 0 && (
        <NonIdealState
          icon="people"
          title="No participants"
          description="Import participants or add them individually."
          action={
            <Button
              icon="import"
              text="Import Participants"
              onClick={() => setImportOpen(true)}
            />
          }
        />
      )}

      {!loading && participants.length > 0 && (
        <HTMLTable
          striped
          className={Classes.HTML_TABLE}
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 120 }}>Voter ID</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong style={{ fontSize: 13 }}>{p.voter_name}</strong>
                </td>
                <td>{p.voter_id}</td>
                <td>
                  <Tag intent={PARTICIPANT_STATUS_INTENT[p.status]} minimal>
                    {PARTICIPANT_STATUS_LABEL[p.status]}
                  </Tag>
                </td>
                <td>
                  <Button
                    minimal
                    small
                    icon="eye-open"
                    aria-label={`View ${p.voter_name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      <ParticipantImportDialog
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        pollId={pollId}
        onImported={onMutate}
      />
    </div>
  );
}
