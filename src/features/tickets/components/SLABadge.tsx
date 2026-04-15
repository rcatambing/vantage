import { Tag, Intent } from "@blueprintjs/core";

interface Props {
  slaBreached: boolean;
  slaDueAt: string | null;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function SLABadge({ slaBreached, slaDueAt }: Props) {
  if (!slaDueAt) return null;

  if (slaBreached) {
    return (
      <Tag intent={Intent.DANGER} icon="warning-sign">
        SLA Breached
      </Tag>
    );
  }

  const dueDate = new Date(slaDueAt);
  const now = new Date();
  const hoursUntilDue =
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
    return (
      <Tag intent={Intent.WARNING} icon="time">
        SLA Due Soon
      </Tag>
    );
  }

  return (
    <Tag minimal>
      SLA: {formatDate(slaDueAt)}
    </Tag>
  );
}
