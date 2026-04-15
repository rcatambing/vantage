import { HTMLTable, Classes } from "@blueprintjs/core";
import { useNavigate } from "react-router";
import type { TicketSummary } from "../types";
import { TICKET_TYPE_LABEL } from "../types";
import TicketSeverityTag from "./TicketSeverityTag";
import TicketStatusTag from "./TicketStatusTag";
import SLABadge from "./SLABadge";

interface Props {
  tickets: TicketSummary[];
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function TicketListTable({ tickets }: Props) {
  const navigate = useNavigate();

  return (
    <HTMLTable
      striped
      interactive
      bordered
      style={{ width: "100%", fontSize: 12 }}
    >
      <thead>
        <tr>
          <th>Ticket #</th>
          <th>Title</th>
          <th>Type</th>
          <th>Severity</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>SLA</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr
            key={t.id}
            onClick={() => navigate(`/tickets/${t.id}`)}
            style={{
              cursor: "pointer",
              borderLeft: t.sla_breached
                ? "2px solid var(--bp5-intent-danger-default, #da1e28)"
                : undefined,
            }}
          >
            <td>
              <code className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                {t.ticket_number}
              </code>
            </td>
            <td>
              <span style={{ fontWeight: 500 }}>{t.title}</span>
            </td>
            <td>{TICKET_TYPE_LABEL[t.ticket_type] ?? t.ticket_type}</td>
            <td>
              <TicketSeverityTag severity={t.severity} />
            </td>
            <td>
              <TicketStatusTag status={t.status} />
            </td>
            <td>{formatDate(t.due_date)}</td>
            <td>
              <SLABadge
                slaBreached={t.sla_breached}
                slaDueAt={t.sla_due_at}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
}
