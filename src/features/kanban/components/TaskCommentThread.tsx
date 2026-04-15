import { useState } from "react";
import { TextArea, Button, Tooltip, Tag } from "@blueprintjs/core";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TaskComment } from "../types";

interface TaskCommentThreadProps {
  taskId: string;
}

const DEMO_COMMENTS: TaskComment[] = [
  {
    id: 1,
    task_id: "demo-1",
    user_id: 1,
    username: "riemann",
    full_name: "Bernhard Riemann",
    content: "I've started the initial research phase. Will have demographics data by Friday.",
    edit_history: null,
    created_at: "2026-03-28T14:00:00",
    updated_at: null,
  },
  {
    id: 2,
    task_id: "demo-1",
    user_id: 2,
    username: "euler",
    full_name: "Leonhard Euler",
    content: "Great, I can help with the data analysis once you have the numbers.",
    edit_history: [{ content: "Great, let me know once you have it.", edited_at: "2026-03-28T15:30:00" }],
    created_at: "2026-03-28T15:00:00",
    updated_at: "2026-03-28T15:30:00",
  },
];

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
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function TaskCommentThread({ taskId }: TaskCommentThreadProps) {
  const [comments, setComments] = useState<TaskComment[]>(
    DEMO_COMMENTS.filter((c) => c.task_id === taskId || taskId !== "")
  );
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const newComment: TaskComment = {
      id: Date.now(),
      task_id: taskId,
      user_id: 1,
      username: "riemann",
      full_name: "Bernhard Riemann",
      content: text,
      edit_history: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    setComments((prev) => [...prev, newComment]);
    setDraft("");
  };

  return (
    <div>
      {comments.map((c) => (
        <div key={c.id} className="kanban-comment">
          <span className="kanban-avatar">{getInitials(c.full_name)}</span>
          <div className="kanban-comment-body">
            <div className="kanban-comment-header">
              <span className="kanban-comment-author">{c.full_name}</span>
              <span className="kanban-comment-time">{formatTime(c.created_at)}</span>
              {c.edit_history && c.edit_history.length > 0 && (
                <Tooltip
                  content={`Last edited: ${formatTime(c.edit_history[c.edit_history.length - 1].edited_at)}`}
                  placement="top"
                >
                  <Tag minimal className="kanban-comment-edited">edited</Tag>
                </Tooltip>
              )}
            </div>
            <div className="kanban-comment-content">
              <Markdown remarkPlugins={[remarkGfm]}>{c.content}</Markdown>
            </div>
          </div>
        </div>
      ))}
      <div className="kanban-comment-input">
        <TextArea
          fill
          rows={2}
          placeholder="Write a comment..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button icon="send-message" intent="primary" onClick={handleSend} disabled={!draft.trim()} aria-label="Send comment" />
      </div>
    </div>
  );
}
