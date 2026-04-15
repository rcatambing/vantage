import { Tag, Intent, Tooltip } from "@blueprintjs/core";

interface Props {
  is_orphan: boolean;
}

/**
 * Renders a warning badge when an objective has no tasks (BR-024).
 * The badge explains why progress is stuck at 0%.
 */
export default function ObjectiveWarningBadge({ is_orphan }: Props) {
  if (!is_orphan) return null;

  return (
    <Tooltip content="No tasks assigned to this objective. Progress cannot be tracked until tasks are added.">
      <Tag intent={Intent.WARNING} minimal icon="warning-sign">
        No tasks
      </Tag>
    </Tooltip>
  );
}
