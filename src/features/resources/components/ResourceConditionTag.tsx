import { Intent, Tag } from "@blueprintjs/core";
import type { ResourceCondition } from "../types";
import { RESOURCE_CONDITION_INTENT, RESOURCE_CONDITION_LABEL } from "../types";

interface Props {
  condition: ResourceCondition;
}

export function ResourceConditionTag({ condition }: Props) {
  return (
    <Tag minimal intent={RESOURCE_CONDITION_INTENT[condition] ?? Intent.NONE}>
      {RESOURCE_CONDITION_LABEL[condition] ?? condition}
    </Tag>
  );
}
