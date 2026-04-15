import { Intent, Tag } from "@blueprintjs/core";
import type { OfficeStatus } from "../types";
import { OFFICE_STATUS_INTENT, OFFICE_STATUS_LABEL } from "../types";

interface Props {
  status: OfficeStatus;
}

export function OfficeStatusTag({ status }: Props) {
  return (
    <Tag minimal intent={OFFICE_STATUS_INTENT[status] ?? Intent.NONE}>
      {OFFICE_STATUS_LABEL[status] ?? status}
    </Tag>
  );
}
