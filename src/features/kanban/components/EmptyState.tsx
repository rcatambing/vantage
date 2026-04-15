import { NonIdealState, Icon } from "@blueprintjs/core";
import type { IconName } from "@blueprintjs/icons";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export default function EmptyState({ title, description, icon = "grid-view" }: EmptyStateProps) {
  return (
    <div className="kanban-empty">
      <NonIdealState
        icon={<Icon icon={icon as IconName} size={48} />}
        title={title}
        description={description}
      />
    </div>
  );
}
