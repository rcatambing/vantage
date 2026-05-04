import { useState } from "react";
import {
  Button,
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  HTMLTable,
  Classes,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { usePollList } from "../hooks/usePolls";
import { POLL_STATUS_INTENT, POLL_STATUS_LABEL } from "../types";
import type { PollStatus } from "../types";
import PollCreateWizard from "./PollCreateWizard";
import PollLifecycleActions from "./PollLifecycleActions";

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

function StatusTag({ status }: { status: PollStatus }) {
  return (
    <Tag intent={POLL_STATUS_INTENT[status]} minimal>
      {POLL_STATUS_LABEL[status]}
    </Tag>
  );
}

export default function PollsPage() {
  const { campaignId } = useParams<{ campaignId?: string }>();
  const navigate = useNavigate();
  const { polls, loading, error, refetch } = usePollList(campaignId);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Polls</h2>
        <Tag minimal intent={Intent.NONE} style={{ fontSize: 12 }}>
          {polls.length}
        </Tag>
        <div style={{ marginLeft: "auto" }}>
          <Button
            icon="plus"
            intent={Intent.PRIMARY}
            text="New Poll"
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </div>

      {/* Content area */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 60,
          }}
        >
          <Spinner size={20} />
        </div>
      )}

      {error && (
        <Callout
          intent={Intent.DANGER}
          icon="error"
          title="Could not load polls"
          style={{ marginBottom: 16 }}
        >
          {error}
        </Callout>
      )}

      {!loading && !error && polls.length === 0 && (
        <NonIdealState
          icon="chat"
          title="No polls"
          description="Create the first poll for this campaign."
          action={
            <Button
              intent={Intent.PRIMARY}
              icon="plus"
              text="New Poll"
              onClick={() => setCreateOpen(true)}
            />
          }
        />
      )}

      {!loading && !error && polls.length > 0 && (
        <HTMLTable
          striped
          interactive
          className={Classes.HTML_TABLE}
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 120 }}>Responses</th>
              <th style={{ width: 100 }}>Target</th>
              <th style={{ width: 140 }}>Created</th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll) => (
              <tr
                key={poll.id}
                onClick={() => navigate(`/polls/${poll.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <strong style={{ fontSize: 13 }}>{poll.name}</strong>
                  <br />
                  <span
                    className={Classes.TEXT_MUTED}
                    style={{ fontSize: 12 }}
                  >
                    {poll.description}
                  </span>
                </td>
                <td>
                  <StatusTag status={poll.status} />
                </td>
                <td>
                  {poll.actual_response_count} / {poll.target_response_count}
                </td>
                <td>{poll.target_response_count}</td>
                <td>{formatDate(poll.created_at)}</td>
                <td>
                  <div
                    style={{ display: "flex", gap: 4 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PollLifecycleActions
                      pollId={poll.id}
                      status={poll.status}
                      onMutate={refetch}
                      compact
                    />
                    <Button
                      minimal
                      small
                      icon="eye-open"
                      onClick={() => navigate(`/polls/${poll.id}`)}
                      aria-label={`View ${poll.name}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}

      <PollCreateWizard
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        campaignId={campaignId ?? ""}
        onCreated={refetch}
      />
    </div>
  );
}
