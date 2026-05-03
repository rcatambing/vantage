import { useState } from "react";
import { Checkbox, Button, InputGroup, Intent } from "@blueprintjs/core";
import type { TaskMilestone } from "../types";
import { useTaskMutations } from "../hooks/useTaskMutations";

interface Props {
  taskId: string;
  milestones: TaskMilestone[];
  onMutate: () => void;
}

export default function MilestoneChecklist({
  taskId,
  milestones,
  onMutate,
}: Props) {
  const { addMilestone, editMilestone, removeMilestone } = useTaskMutations({
    onSuccess: onMutate,
  });
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const completedCount = milestones.filter((m) => m.is_completed).length;
  const percent =
    milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;

  const handleToggle = async (milestone: TaskMilestone) => {
    await editMilestone(milestone.id, {
      is_completed: !milestone.is_completed,
    });
  };

  const handleAdd = async () => {
    const title = newTitle.trim();
    if (!title) return;
    setAdding(true);
    await addMilestone(taskId, { title });
    setAdding(false);
    setNewTitle("");
  };

  const handleRemove = async (id: string) => {
    await removeMilestone(id);
  };

  return (
    <div>
      {/* Progress bar */}
      {milestones.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 6,
              background: "var(--cds-border-subtle, #393939)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background:
                  percent >= 80
                    ? "#24a148"
                    : percent >= 40
                      ? "#0f62fe"
                      : "#f1c21b",
                transition: "width 200ms ease",
              }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {completedCount}/{milestones.length}
          </span>
        </div>
      )}

      {/* Checklist */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {milestones.map((m) => (
          <li
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 0",
            }}
          >
            <Checkbox
              checked={m.is_completed}
              onChange={() => handleToggle(m)}
              labelElement={
                <span
                  style={{
                    textDecoration: m.is_completed ? "line-through" : undefined,
                    opacity: m.is_completed ? 0.65 : 1,
                    fontSize: 14,
                  }}
                >
                  {m.title}
                </span>
              }
            />
            <Button
              icon="trash"
              minimal
              small
              intent={Intent.DANGER}
              onClick={() => handleRemove(m.id)}
              style={{ marginLeft: "auto" }}
            />
          </li>
        ))}
      </ul>

      {/* Add new */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <InputGroup
          placeholder="Add a milestone…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          fill
        />
        <Button
          icon="plus"
          intent={Intent.PRIMARY}
          onClick={handleAdd}
          loading={adding}
          disabled={!newTitle.trim()}
        />
      </div>
    </div>
  );
}
