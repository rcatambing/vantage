import { Tag } from "@blueprintjs/core";
import type { TicketStatus } from "../types";
import { TICKET_STATUS_INTENT, TICKET_STATUS_LABEL } from "../types";

export default function TicketStatusTag({
  status,
}: {
  status: TicketStatus;
}) {
  return (
    <Tag intent={TICKET_STATUS_INTENT[status]} minimal>
      {TICKET_STATUS_LABEL[status]}
    </Tag>
  );
}
