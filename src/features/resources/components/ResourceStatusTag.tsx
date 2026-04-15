import { Intent, Tag } from "@blueprintjs/core";
import type { ResourceStatus } from "../types";
import { RESOURCE_STATUS_INTENT, RESOURCE_STATUS_LABEL } from "../types";

interface Props {
  status: ResourceStatus;
}

export function ResourceStatusTag({ status }: Props) {
  return (
    <Tag minimal intent={RESOURCE_STATUS_INTENT[status] ?? Intent.NONE}>
      {RESOURCE_STATUS_LABEL[status] ?? status}
    </Tag>
  );
}
