import { Tag, Intent } from "@blueprintjs/core";

interface Props {
  isOverdue: boolean;
  dueDate: string | null;
}

export default function OverdueFlag({ isOverdue, dueDate }: Props) {
  if (!isOverdue) return null;

  const formattedDue = dueDate
    ? new Date(dueDate).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "unknown date";

  return (
    <Tag
      intent={Intent.DANGER}
      icon="warning-sign"
      aria-label={`This task is overdue. Due date was ${formattedDue}.`}
      style={{ marginBottom: 12 }}
    >
      Overdue
    </Tag>
  );
}
