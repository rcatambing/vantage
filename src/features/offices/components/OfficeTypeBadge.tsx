import { Tag } from "@blueprintjs/core";
import type { OfficeType } from "../types";
import { OFFICE_TYPE_LABEL } from "../types";

interface Props {
  type: OfficeType;
}

export function OfficeTypeBadge({ type }: Props) {
  return (
    <Tag minimal>
      {OFFICE_TYPE_LABEL[type] ?? type}
    </Tag>
  );
}
