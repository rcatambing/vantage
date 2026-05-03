import { useState } from "react";
import { TextArea, Button, Tag, Classes } from "@blueprintjs/core";
import type { TaskComment } from "../types";
import { useTaskMutations } from "../hooks/useTaskMutations";

interface Props {
  taskId: string;
  comments: TaskComment[];
  onMutate: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export default function TaskCommentThread({
  taskId,
  comments,
  onMutate,
}: Props) {
  const { addComment } = useTaskMutations({ onSuccess: onMutate });
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setSending(true);
    await addComment(taskId, { content: text });
    setSending(false);
    setDraft("");
  };

  return (
    <div>
      {comments.length === 0 && (
        <p className={Classes.TEXT_MUTED} style={{ fontSize: 13 }}>
          No comments yet.
        </p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            gap: 10,
            padding: "10px 0",
            borderBottom: "1px solid var(--cds-border-subtle, #393939)",
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--kanban-accent, #78a9ff)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(c.full_name)}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {c.full_name}
              </span>
              <span
                className={Classes.TEXT_MUTED}
                style={{ fontSize: 12 }}
              >
                {formatTime(c.created_at)}
              </span>
              {c.updated_at && c.updated_at !== c.created_at && (
                <Tag minimal style={{ fontSize: 11 }}>
                  edited
                </Tag>
              )}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{c.content}</div>
          </div>
        </div>
      ))}

      {/* Add comment */}
      <div style={{ marginTop: 16 }}>
        <TextArea
          fill
          rows={2}
          placeholder="Write a comment…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <Button
            intent="primary"
            icon="send-message"
            text="Comment"
            onClick={handleSend}
            loading={sending}
            disabled={!draft.trim()}
          />
        </div>
      </div>
    </div>
  );
}
