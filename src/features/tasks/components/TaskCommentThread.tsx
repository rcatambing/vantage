import { useState } from "react";
import { TextArea, Button, Tag, Classes, Intent, Collapse } from "@blueprintjs/core";
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
  const { addComment, editComment, removeComment } = useTaskMutations({
    onSuccess: onMutate,
  });
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setSending(true);
    await addComment(taskId, { content: text });
    setSending(false);
    setDraft("");
  };

  const startEdit = (comment: TaskComment) => {
    setEditingId(comment.id);
    setEditDraft(comment.content);
  };

  const saveEdit = async (commentId: string) => {
    const text = editDraft.trim();
    if (!text) return;
    const success = await editComment(commentId, { content: text });
    if (success) setEditingId(null);
  };

  const toggleHistory = (commentId: string) => {
    setExpandedHistory((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
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
                <Button
                  minimal
                  small
                  style={{ fontSize: 11, padding: 0, minHeight: 18 }}
                  onClick={() => toggleHistory(c.id)}
                >
                  <Tag minimal style={{ fontSize: 11 }}>
                    Edited
                  </Tag>
                </Button>
              )}
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {editingId !== c.id && (
                  <>
                    <Button
                      icon="edit"
                      minimal
                      small
                      onClick={() => startEdit(c)}
                      aria-label={`Edit comment by ${c.full_name}`}
                    />
                    <Button
                      icon="trash"
                      minimal
                      small
                      intent={Intent.DANGER}
                      onClick={() => removeComment(c.id)}
                      aria-label={`Delete comment by ${c.full_name}`}
                    />
                  </>
                )}
              </div>
            </div>

            {editingId === c.id ? (
              <div>
                <TextArea
                  fill
                  rows={2}
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  autoFocus
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Button
                    small
                    intent={Intent.PRIMARY}
                    text="Save"
                    onClick={() => saveEdit(c.id)}
                    disabled={!editDraft.trim()}
                  />
                  <Button
                    small
                    minimal
                    text="Cancel"
                    onClick={() => setEditingId(null)}
                  />
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{c.content}</div>
            )}

            {/* Edit history */}
            {c.edit_history && c.edit_history.length > 0 && (
              <Collapse isOpen={expandedHistory.has(c.id)}>
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 12px",
                    background: "var(--cds-layer-01, #262626)",
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--cds-text-secondary, #c6c6c6)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Edit History
                  </div>
                  {c.edit_history.map((entry, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "4px 0",
                        borderBottom:
                          idx < c.edit_history!.length - 1
                            ? "1px solid var(--cds-border-subtle, #393939)"
                            : undefined,
                      }}
                    >
                      <div
                        className={Classes.TEXT_MUTED}
                        style={{ fontSize: 11, marginBottom: 2 }}
                      >
                        {formatTime(entry.edited_at)}
                      </div>
                        <div>{entry.previous_content}</div>
                    </div>
                  ))}
                </div>
              </Collapse>
            )}
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
