import { Icon, Tag } from "@blueprintjs/core";
import type { ResourceType } from "../types";
import { RESOURCE_TYPE_LABEL, RESOURCE_TYPE_ICON } from "../types";

interface Props {
  type: ResourceType;
}

export function ResourceTypeBadge({ type }: Props) {
  const icon = RESOURCE_TYPE_ICON[type];
  return (
    <Tag minimal icon={icon ? <Icon icon={icon as any} size={12} /> : undefined}>
      {RESOURCE_TYPE_LABEL[type] ?? type}
    </Tag>
  );
}
