import { Icon, Checkbox, Tag, Intent, Classes } from "@blueprintjs/core";

interface Task {
  id: string;
  title: string;
  status: "done" | "in-progress" | "pending";
  assignee: string;
  priority: "high" | "medium" | "low";
}

interface Props {
  tasks: Task[];
}

const priorityIntent: Record<string, Intent> = {
  high: Intent.DANGER,
  medium: Intent.WARNING,
  low: Intent.NONE,
};

export default function TaskList({ tasks }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 0",
            borderBottom: "1px solid var(--cds-border-subtle)",
          }}
        >
          <Checkbox
            checked={task.status === "done"}
            indeterminate={task.status === "in-progress"}
            readOnly
            style={{ margin: 0 }}
          />
          <span style={{ flex: 1, fontSize: 13, textDecoration: task.status === "done" ? "line-through" : undefined }}>
            {task.title}
          </span>
          <Tag minimal intent={priorityIntent[task.priority]} style={{ fontSize: 12 }}>
            {task.priority}
          </Tag>
          <span className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
            <Icon icon="person" size={10} /> {task.assignee}
          </span>
        </div>
      ))}
    </div>
  );
}
