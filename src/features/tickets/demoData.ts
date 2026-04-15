import { isDemoModeEnabled, DEMO_CAMPAIGNS } from "../accounts/demoData";
import type {
  Ticket,
  TicketSummary,
  TicketRelationship,
  ReassignmentEntry,
  TicketLocationHistoryEntry,
  TicketCreatePayload,
  TicketUpdatePayload,
  PaginatedTickets,
  TicketsQueryParams,
} from "./types";

export { isDemoModeEnabled };

const nowIso = () => new Date().toISOString();

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 25,
): { items: T[]; total: number; page: number; page_size: number } {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    page_size: pageSize,
  };
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const pastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const futureDate = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
};

let tickets: Ticket[] = [
  {
    id: "T-001",
    ticket_number: "TK-2026-0001",
    title: "Set up voter registration booths in District 1",
    description:
      "Deploy 5 registration booths across all barangays in District 1 before the registration deadline.",
    ticket_type: "TASK",
    severity: "HIGH",
    status: "IN_PROGRESS",
    campaign_id: DEMO_CAMPAIGNS[0].id,
    objective_id: null,
    owner_id: "12",
    assignee_id: "15",
    assignee_team_id: "TEAM-01",
    due_date: futureDate(7),
    sla_due_at: futureDate(3),
    sla_breached: false,
    has_location: true,
    created_at: pastDate(10),
    resolved_at: null,
    relationships: [],
    reassignment_history: [
      {
        id: "RA-001",
        from_user_id: null,
        to_user_id: "15",
        from_team_id: null,
        to_team_id: "TEAM-01",
        reassigned_at: pastDate(10),
        reassigned_by: "12",
      },
    ],
    location_history: [],
  },
  {
    id: "T-002",
    ticket_number: "TK-2026-0002",
    title: "Broken sound system at rally venue",
    description:
      "The main PA system failed during Saturday's rally at Plaza Miranda. Need replacement ASAP for next event.",
    ticket_type: "INCIDENT",
    severity: "CRITICAL",
    status: "OPEN",
    campaign_id: DEMO_CAMPAIGNS[0].id,
    objective_id: null,
    owner_id: "12",
    assignee_id: "22",
    assignee_team_id: "TEAM-02",
    due_date: futureDate(1),
    sla_due_at: pastDate(1),
    sla_breached: true,
    has_location: true,
    created_at: pastDate(3),
    resolved_at: null,
    relationships: [],
    reassignment_history: [
      {
        id: "RA-002",
        from_user_id: null,
        to_user_id: "24",
        from_team_id: null,
        to_team_id: "TEAM-02",
        reassigned_at: pastDate(3),
        reassigned_by: "12",
      },
      {
        id: "RA-003",
        from_user_id: "24",
        to_user_id: "22",
        from_team_id: "TEAM-02",
        to_team_id: "TEAM-02",
        reassigned_at: pastDate(2),
        reassigned_by: "15",
      },
    ],
    location_history: [
      {
        id: "LH-001",
        ticket_id: "T-002",
        changed_by: "15",
        changed_at: pastDate(2),
        change_reason: "Corrected venue address after site visit",
        changed_fields: ["full_address", "barangay_or_district"],
        old_values: {
          full_address: "Plaza Miranda, Quiapo",
          barangay_or_district: "Quiapo",
        },
        new_values: {
          full_address: "Plaza Miranda, 800 Quezon Blvd, Quiapo, Manila",
          barangay_or_district: "Barangay 382",
        },
      },
    ],
  },
  {
    id: "T-003",
    ticket_number: "TK-2026-0003",
    title: "Request for campaign flyer reprints",
    description:
      "Need 10,000 additional copies of the District 3 flyer with updated QR codes pointing to the new volunteer sign-up page.",
    ticket_type: "REQUEST",
    severity: "MODERATE",
    status: "OPEN",
    campaign_id: DEMO_CAMPAIGNS[0].id,
    objective_id: null,
    owner_id: "15",
    assignee_id: null,
    assignee_team_id: "TEAM-03",
    due_date: futureDate(14),
    sla_due_at: futureDate(5),
    sla_breached: false,
    has_location: false,
    created_at: pastDate(5),
    resolved_at: null,
    relationships: [],
    reassignment_history: [],
    location_history: [],
  },
  {
    id: "T-004",
    ticket_number: "TK-2026-0004",
    title: "Coordinate volunteer training schedule",
    description:
      "Organize 3-day training for 50 new volunteers covering canvassing protocols and data collection procedures.",
    ticket_type: "TASK",
    severity: "MODERATE",
    status: "COMPLETED",
    campaign_id: DEMO_CAMPAIGNS[0].id,
    objective_id: null,
    owner_id: "12",
    assignee_id: "15",
    assignee_team_id: "TEAM-01",
    due_date: pastDate(2),
    sla_due_at: pastDate(3),
    sla_breached: false,
    has_location: true,
    created_at: pastDate(15),
    resolved_at: pastDate(2),
    relationships: [],
    reassignment_history: [
      {
        id: "RA-004",
        from_user_id: null,
        to_user_id: "15",
        from_team_id: null,
        to_team_id: "TEAM-01",
        reassigned_at: pastDate(15),
        reassigned_by: "12",
      },
    ],
    location_history: [],
  },
  {
    id: "T-005",
    ticket_number: "TK-2026-0005",
    title: "Social media outage — campaign page inaccessible",
    description:
      "The official campaign Facebook page was temporarily restricted. Escalated to platform support. Monitoring status.",
    ticket_type: "INCIDENT",
    severity: "HIGH",
    status: "ON_HOLD",
    campaign_id: DEMO_CAMPAIGNS[0].id,
    objective_id: null,
    owner_id: "22",
    assignee_id: "26",
    assignee_team_id: "TEAM-03",
    due_date: null,
    sla_due_at: futureDate(1),
    sla_breached: false,
    has_location: false,
    created_at: pastDate(4),
    resolved_at: null,
    relationships: [],
    reassignment_history: [
      {
        id: "RA-005",
        from_user_id: null,
        to_user_id: "22",
        from_team_id: null,
        to_team_id: "TEAM-03",
        reassigned_at: pastDate(4),
        reassigned_by: "12",
      },
      {
        id: "RA-006",
        from_user_id: "22",
        to_user_id: "26",
        from_team_id: "TEAM-03",
        to_team_id: "TEAM-03",
        reassigned_at: pastDate(3),
        reassigned_by: "22",
      },
    ],
    location_history: [],
  },
  {
    id: "T-006",
    ticket_number: "TK-2026-0006",
    title: "Draft press release for consumer growth launch",
    description: null,
    ticket_type: "TASK",
    severity: "LOW",
    status: "DRAFT",
    campaign_id: DEMO_CAMPAIGNS[1].id,
    objective_id: null,
    owner_id: "22",
    assignee_id: null,
    assignee_team_id: null,
    due_date: futureDate(21),
    sla_due_at: null,
    sla_breached: false,
    has_location: false,
    created_at: pastDate(1),
    resolved_at: null,
    relationships: [],
    reassignment_history: [],
    location_history: [],
  },
  {
    id: "T-007",
    ticket_number: "TK-2026-0007",
    title: "Inspect public service kiosk in Barangay 74",
    description:
      "Verify the kiosk installation is operational and the pilot sign-up forms are accessible to residents.",
    ticket_type: "TASK",
    severity: "MODERATE",
    status: "IN_PROGRESS",
    campaign_id: DEMO_CAMPAIGNS[2].id,
    objective_id: null,
    owner_id: "26",
    assignee_id: "15",
    assignee_team_id: "TEAM-01",
    due_date: futureDate(5),
    sla_due_at: futureDate(2),
    sla_breached: false,
    has_location: true,
    created_at: pastDate(6),
    resolved_at: null,
    relationships: [],
    reassignment_history: [
      {
        id: "RA-007",
        from_user_id: null,
        to_user_id: "15",
        from_team_id: null,
        to_team_id: "TEAM-01",
        reassigned_at: pastDate(6),
        reassigned_by: "26",
      },
    ],
    location_history: [],
  },
  {
    id: "T-008",
    ticket_number: "TK-2026-0008",
    title: "Cancelled: Outdoor banner permit application",
    description:
      "Permit application for outdoor banners was denied by LGU. Ticket cancelled.",
    ticket_type: "REQUEST",
    severity: "LOW",
    status: "CANCELLED",
    campaign_id: DEMO_CAMPAIGNS[0].id,
    objective_id: null,
    owner_id: "15",
    assignee_id: "15",
    assignee_team_id: "TEAM-01",
    due_date: pastDate(8),
    sla_due_at: pastDate(10),
    sla_breached: true,
    has_location: true,
    created_at: pastDate(20),
    resolved_at: pastDate(8),
    relationships: [],
    reassignment_history: [],
    location_history: [],
  },
];

// Wire up cross-references
tickets[0].relationships = [
  {
    id: "REL-001",
    kind: "RELATES_TO",
    related_ticket_id: "T-003",
    related_ticket_number: "TK-2026-0003",
    related_ticket_title: "Request for campaign flyer reprints",
  },
];
tickets[1].relationships = [
  {
    id: "REL-002",
    kind: "DEPENDS",
    related_ticket_id: "T-005",
    related_ticket_number: "TK-2026-0005",
    related_ticket_title:
      "Social media outage — campaign page inaccessible",
  },
];
tickets[2].relationships = [
  {
    id: "REL-003",
    kind: "RELATES_TO",
    related_ticket_id: "T-001",
    related_ticket_number: "TK-2026-0001",
    related_ticket_title:
      "Set up voter registration booths in District 1",
  },
];

// ---------------------------------------------------------------------------
// Demo CRUD functions
// ---------------------------------------------------------------------------

function toSummary(t: Ticket): TicketSummary {
  const {
    description: _d,
    relationships: _r,
    reassignment_history: _ra,
    location_history: _lh,
    ...summary
  } = t;
  return summary;
}

export function listDemoTickets(
  params: TicketsQueryParams = {},
): PaginatedTickets {
  const filtered = tickets.filter((t) => {
    if (params.campaign_id && t.campaign_id !== String(params.campaign_id))
      return false;
    if (params.status && t.status !== params.status) return false;
    if (params.ticket_type && t.ticket_type !== params.ticket_type)
      return false;
    if (params.severity && t.severity !== params.severity) return false;
    if (params.assignee_id && t.assignee_id !== String(params.assignee_id))
      return false;
    if (params.sla_breached != null && t.sla_breached !== params.sla_breached)
      return false;
    if (params.has_location != null && t.has_location !== params.has_location)
      return false;
    return true;
  });

  const summaries = filtered.map(toSummary);
  return paginate(summaries, params.page ?? 1, params.page_size ?? 25);
}

export function getDemoTicket(id: string): Ticket {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) throw new Error("Ticket not found");
  return deepClone(ticket);
}

export function createDemoTicket(
  payload: TicketCreatePayload,
): { message: string; data: TicketSummary } {
  const newTicket: Ticket = {
    id: `T-${String(tickets.length + 1).padStart(3, "0")}`,
    ticket_number: `TK-2026-${String(tickets.length + 1).padStart(4, "0")}`,
    title: payload.title,
    description: payload.description ?? null,
    ticket_type: payload.ticket_type,
    severity: payload.severity,
    status: "DRAFT",
    campaign_id: String(payload.campaign_id),
    objective_id: payload.objective_id ?? null,
    owner_id: "1",
    assignee_id: payload.assignee_id ?? null,
    assignee_team_id: payload.assignee_team_id ?? null,
    due_date: payload.due_date ?? null,
    sla_due_at: null,
    sla_breached: false,
    has_location: payload.service_location != null,
    created_at: nowIso(),
    resolved_at: null,
    relationships: [],
    reassignment_history: [],
    location_history: [],
  };
  tickets = [newTicket, ...tickets];
  return { message: "Ticket created", data: toSummary(newTicket) };
}

export function updateDemoTicket(
  id: string,
  payload: TicketUpdatePayload,
): { message: string; data: TicketSummary } {
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx < 0) throw new Error("Ticket not found");

  const current = tickets[idx];
  const resolved =
    payload.status === "COMPLETED" || payload.status === "CANCELLED"
      ? nowIso()
      : current.resolved_at;

  const updated: Ticket = {
    ...current,
    title: payload.title ?? current.title,
    description:
      payload.description !== undefined
        ? payload.description ?? null
        : current.description,
    severity: payload.severity ?? current.severity,
    status: payload.status ?? current.status,
    objective_id:
      payload.objective_id !== undefined
        ? payload.objective_id ?? null
        : current.objective_id,
    assignee_id:
      payload.assignee_id !== undefined
        ? payload.assignee_id ?? null
        : current.assignee_id,
    assignee_team_id:
      payload.assignee_team_id !== undefined
        ? payload.assignee_team_id ?? null
        : current.assignee_team_id,
    due_date:
      payload.due_date !== undefined
        ? payload.due_date ?? null
        : current.due_date,
    has_location: payload.service_location
      ? true
      : current.has_location,
    resolved_at: resolved,
  };

  // Track location changes
  if (payload.service_location && payload.change_reason) {
    updated.location_history = [
      {
        id: `LH-${String(Date.now())}`,
        ticket_id: id,
        changed_by: "1",
        changed_at: nowIso(),
        change_reason: payload.change_reason,
        changed_fields: Object.keys(payload.service_location),
        old_values: {},
        new_values: payload.service_location as Record<string, unknown>,
      },
      ...current.location_history,
    ];
  }

  // Track reassignment
  if (
    payload.assignee_id !== undefined &&
    payload.assignee_id !== current.assignee_id
  ) {
    updated.reassignment_history = [
      {
        id: `RA-${String(Date.now())}`,
        from_user_id: current.assignee_id,
        to_user_id: payload.assignee_id ?? null,
        from_team_id: current.assignee_team_id,
        to_team_id: payload.assignee_team_id ?? current.assignee_team_id,
        reassigned_at: nowIso(),
        reassigned_by: "1",
      },
      ...current.reassignment_history,
    ];
  }

  tickets[idx] = updated;
  return { message: "Ticket updated", data: toSummary(updated) };
}

export function deleteDemoTicket(id: string): void {
  tickets = tickets.filter((t) => t.id !== id);
}

export function addDemoRelationship(
  ticketId: string,
  payload: { kind: string; related_ticket_id: string },
): { message: string } {
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx < 0) throw new Error("Ticket not found");

  const related = tickets.find((t) => t.id === payload.related_ticket_id);
  if (!related) throw new Error("Related ticket not found");

  const rel: TicketRelationship = {
    id: `REL-${String(Date.now())}`,
    kind: payload.kind as TicketRelationship["kind"],
    related_ticket_id: related.id,
    related_ticket_number: related.ticket_number,
    related_ticket_title: related.title,
  };

  tickets[idx] = {
    ...tickets[idx],
    relationships: [...tickets[idx].relationships, rel],
  };

  return { message: "Relationship added" };
}

export function removeDemoRelationship(
  ticketId: string,
  relId: string,
): void {
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx < 0) throw new Error("Ticket not found");

  tickets[idx] = {
    ...tickets[idx],
    relationships: tickets[idx].relationships.filter((r) => r.id !== relId),
  };
}
