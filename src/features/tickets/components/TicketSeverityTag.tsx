import { Tag } from "@blueprintjs/core";
import type { TicketSeverity } from "../types";
import { TICKET_SEVERITY_INTENT, TICKET_SEVERITY_LABEL } from "../types";

export default function TicketSeverityTag({
  severity,
}: {
  severity: TicketSeverity;
}) {
  return (
    <Tag intent={TICKET_SEVERITY_INTENT[severity]} minimal>
      {TICKET_SEVERITY_LABEL[severity]}
    </Tag>
  );
}
