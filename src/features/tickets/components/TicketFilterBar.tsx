import {
  ControlGroup,
  HTMLSelect,
  Checkbox,
  Button,
  InputGroup,
} from "@blueprintjs/core";
import type {
  TicketType,
  TicketSeverity,
  TicketStatus,
  TicketsQueryParams,
} from "../types";

interface Props {
  params: TicketsQueryParams;
  onChange: (next: TicketsQueryParams) => void;
  /** hide campaign filter when scoped to a single campaign */
  hideCampaignFilter?: boolean;
}

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "TASK", label: "Task" },
  { value: "INCIDENT", label: "Incident" },
  { value: "REQUEST", label: "Request" },
];

const SEVERITY_OPTIONS = [
  { value: "", label: "All Severities" },
  { value: "LOW", label: "Low" },
  { value: "MODERATE", label: "Moderate" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ON_HOLD", label: "On Hold" },
];

export default function TicketFilterBar({
  params,
  onChange,
  hideCampaignFilter,
}: Props) {
  const hasFilters =
    params.ticket_type ||
    params.severity ||
    params.status ||
    params.sla_breached;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <ControlGroup>
        {!hideCampaignFilter && (
          <InputGroup
            placeholder="Campaign ID…"
            value={params.campaign_id ?? ""}
            onChange={(e) =>
              onChange({
                ...params,
                campaign_id: e.target.value || undefined,
                page: 1,
              })
            }
            style={{ width: 130 }}
            small
          />
        )}
        <HTMLSelect
          value={params.ticket_type ?? ""}
          onChange={(e) =>
            onChange({
              ...params,
              ticket_type: (e.target.value as TicketType) || undefined,
              page: 1,
            })
          }
          options={TYPE_OPTIONS}
          small
        />
        <HTMLSelect
          value={params.severity ?? ""}
          onChange={(e) =>
            onChange({
              ...params,
              severity: (e.target.value as TicketSeverity) || undefined,
              page: 1,
            })
          }
          options={SEVERITY_OPTIONS}
          small
        />
        <HTMLSelect
          value={params.status ?? ""}
          onChange={(e) =>
            onChange({
              ...params,
              status: (e.target.value as TicketStatus) || undefined,
              page: 1,
            })
          }
          options={STATUS_OPTIONS}
          small
        />
      </ControlGroup>

      <Checkbox
        label="SLA Breached"
        checked={params.sla_breached ?? false}
        onChange={(e) =>
          onChange({
            ...params,
            sla_breached: e.target.checked || undefined,
            page: 1,
          })
        }
        inline
        style={{ marginBottom: 0 }}
      />

      {hasFilters && (
        <Button
          minimal
          small
          text="Clear Filters"
          onClick={() =>
            onChange({
              campaign_id: params.campaign_id,
              page: 1,
              page_size: params.page_size,
            })
          }
        />
      )}
    </div>
  );
}
