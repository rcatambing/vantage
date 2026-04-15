import { isDemoModeEnabled } from "../accounts/demoData";
import type {
  Office,
  OfficeContact,
  CampaignOfficeLink,
  OfficeStaffAssignment,
  OfficeCreatePayload,
  OfficeUpdatePayload,
  ContactCreatePayload,
  ContactUpdatePayload,
  CampaignOfficeLinkPayload,
  StaffAssignPayload,
  StaffRoleUpdatePayload,
  OfficesQueryParams,
  PaginatedOffices,
} from "./types";
import type { Resource } from "../resources/types";

export { isDemoModeEnabled };

const nowIso = () => new Date().toISOString();
let nextId = 100;
const genId = (prefix: string) => `${prefix}-${String(++nextId).padStart(3, "0")}`;

// ─── Contacts (embedded in offices) ──────────────────────────────────────────

const makeContact = (
  id: string,
  officeId: string,
  type: OfficeContact["contact_type"],
  value: string,
  label: string | null,
  isPrimary: boolean,
  order: number,
): OfficeContact => ({
  id,
  office_id: officeId,
  contact_type: type,
  value,
  label,
  is_primary: isPrimary,
  sort_order: order,
  created_at: "2026-03-01T08:00:00.000Z",
  updated_at: null,
});

// ─── Offices ─────────────────────────────────────────────────────────────────

let offices: Office[] = [
  {
    id: "OFF-001",
    office_name: "Kampanya National HQ",
    office_code: "KMP-HQ-001",
    office_type: "HQ",
    status: "ACTIVE",
    description: "National headquarters overseeing all campaign operations. Houses the central strategy team, comms center, and executive offices.",
    capabilities: ["strategy", "communications", "events", "training", "logistics"],
    district_id: "D-NCR-01",
    district_name: "NCR District 1",
    manager_id: "U-001",
    manager_name: "Juan dela Cruz",
    street_address: "15th Floor, One Ayala Tower, Ayala Avenue",
    barangay: "Bel-Air",
    city_municipality: "Makati City",
    province: "Metro Manila",
    zip_code: "1226",
    latitude: 14.5547,
    longitude: 121.0244,
    contacts: [
      makeContact("CON-001", "OFF-001", "PHONE", "+63 2 8888 1234", "Main Line", true, 1),
      makeContact("CON-002", "OFF-001", "EMAIL", "hq@kampanya.ph", "General Inquiries", true, 2),
      makeContact("CON-003", "OFF-001", "MOBILE", "+63 917 123 4567", "Operations Hotline", false, 3),
      makeContact("CON-004", "OFF-001", "FACEBOOK", "https://facebook.com/kampanyahq", "Official Page", true, 4),
    ],
    operating_hours: "Mon-Fri 7:00 AM - 8:00 PM, Sat 8:00 AM - 5:00 PM",
    capacity: 120,
    notes: "24/7 security. Visitor pass required at lobby.",
    opened_date: "2026-01-15",
    closed_date: null,
    data_classification: "internal",
    staff_count: 45,
    resource_count: 8,
    campaign_count: 3,
    created_by: "U-001",
    created_at: "2026-01-15T08:00:00.000Z",
    updated_at: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "OFF-002",
    office_name: "North Luzon Field Office",
    office_code: "NL-FO-001",
    office_type: "FIELD_OFFICE",
    status: "ACTIVE",
    description: "Regional command center for North Luzon operations. Covers Ilocos, Cordillera, and Cagayan Valley regions.",
    capabilities: ["voter-registration", "events", "training", "field-ops"],
    district_id: "D-R1-01",
    district_name: "La Union 1st District",
    manager_id: "U-002",
    manager_name: "Maria Santos",
    street_address: "123 Quezon Avenue",
    barangay: "Catbangen",
    city_municipality: "San Fernando City",
    province: "La Union",
    zip_code: "2500",
    latitude: 16.6159,
    longitude: 120.3209,
    contacts: [
      makeContact("CON-005", "OFF-002", "MOBILE", "+63 921 555 8901", "Office Mobile", true, 1),
      makeContact("CON-006", "OFF-002", "EMAIL", "northluzon@kampanya.ph", null, true, 2),
    ],
    operating_hours: "Mon-Fri 8:00 AM - 5:00 PM",
    capacity: 35,
    notes: null,
    opened_date: "2026-02-01",
    closed_date: null,
    data_classification: "internal",
    staff_count: 12,
    resource_count: 3,
    campaign_count: 1,
    created_by: "U-001",
    created_at: "2026-02-01T08:00:00.000Z",
    updated_at: null,
  },
  {
    id: "OFF-003",
    office_name: "South Luzon Branch",
    office_code: "SL-BR-001",
    office_type: "BRANCH",
    status: "ACTIVE",
    description: "Branch office supporting CALABARZON and MIMAROPA campaign activities. Coordinates with municipal-level volunteers.",
    capabilities: ["voter-registration", "events", "logistics", "volunteer-coordination"],
    district_id: "D-R4A-01",
    district_name: "Laguna 2nd District",
    manager_id: "U-003",
    manager_name: "Roberto Reyes",
    street_address: "45 National Highway",
    barangay: "Parian",
    city_municipality: "Calamba City",
    province: "Laguna",
    zip_code: "4027",
    latitude: 14.2114,
    longitude: 121.1653,
    contacts: [
      makeContact("CON-007", "OFF-003", "PHONE", "+63 49 545 6789", "Landline", true, 1),
      makeContact("CON-008", "OFF-003", "MOBILE", "+63 928 333 4567", null, false, 2),
      makeContact("CON-009", "OFF-003", "EMAIL", "southluzon@kampanya.ph", null, true, 3),
    ],
    operating_hours: "Mon-Fri 8:00 AM - 5:00 PM",
    capacity: 40,
    notes: "Located near Calamba Interchange. Ample parking.",
    opened_date: "2026-02-15",
    closed_date: null,
    data_classification: "internal",
    staff_count: 15,
    resource_count: 4,
    campaign_count: 2,
    created_by: "U-001",
    created_at: "2026-02-15T08:00:00.000Z",
    updated_at: null,
  },
  {
    id: "OFF-004",
    office_name: "Visayas Regional Office",
    office_code: "VIS-RO-001",
    office_type: "FIELD_OFFICE",
    status: "ACTIVE",
    description: "Regional hub for Central, Western, and Eastern Visayas. Manages island-hopping logistics and inter-provincial coordination.",
    capabilities: ["events", "training", "logistics", "media-relations"],
    district_id: "D-R7-01",
    district_name: "Cebu City South",
    manager_id: "U-004",
    manager_name: "Elena Garcia",
    street_address: "Unit 5, Pacific Mall Basement, M.J. Cuenco Avenue",
    barangay: "Mabolo",
    city_municipality: "Cebu City",
    province: "Cebu",
    zip_code: "6000",
    latitude: 10.3157,
    longitude: 123.8854,
    contacts: [
      makeContact("CON-010", "OFF-004", "MOBILE", "+63 932 777 1234", "Regional Hotline", true, 1),
      makeContact("CON-011", "OFF-004", "EMAIL", "visayas@kampanya.ph", null, true, 2),
      makeContact("CON-012", "OFF-004", "INSTAGRAM", "https://instagram.com/kampanya_visayas", null, false, 3),
    ],
    operating_hours: "Mon-Sat 8:00 AM - 6:00 PM",
    capacity: 30,
    notes: "Coordinate ferry schedules for inter-island events.",
    opened_date: "2026-03-01",
    closed_date: null,
    data_classification: "internal",
    staff_count: 10,
    resource_count: 2,
    campaign_count: 1,
    created_by: "U-001",
    created_at: "2026-03-01T08:00:00.000Z",
    updated_at: null,
  },
  {
    id: "OFF-005",
    office_name: "Mindanao Satellite Office",
    office_code: "MIN-SAT-001",
    office_type: "SATELLITE",
    status: "TEMPORARY",
    description: "Temporary satellite office for Mindanao campaign push. Operating during election period only.",
    capabilities: ["voter-registration", "field-ops"],
    district_id: "D-R11-01",
    district_name: "Davao City 1st District",
    manager_id: "U-005",
    manager_name: "Ahmed Ramos",
    street_address: "3rd Floor, Abreeza Mall",
    barangay: "Bajada",
    city_municipality: "Davao City",
    province: "Davao del Sur",
    zip_code: "8000",
    latitude: 7.0731,
    longitude: 125.6128,
    contacts: [
      makeContact("CON-013", "OFF-005", "MOBILE", "+63 945 888 2345", null, true, 1),
    ],
    operating_hours: "Mon-Fri 9:00 AM - 5:00 PM",
    capacity: 15,
    notes: "Temporary lease until July 2026.",
    opened_date: "2026-03-15",
    closed_date: null,
    data_classification: "internal",
    staff_count: 5,
    resource_count: 1,
    campaign_count: 1,
    created_by: "U-001",
    created_at: "2026-03-15T08:00:00.000Z",
    updated_at: null,
  },
  {
    id: "OFF-006",
    office_name: "NCR Warehouse",
    office_code: "NCR-WH-001",
    office_type: "WAREHOUSE",
    status: "ACTIVE",
    description: "Central warehouse for campaign materials, vehicles, and equipment. Handles distribution to all regional offices.",
    capabilities: ["logistics", "storage", "fleet-management"],
    district_id: "D-NCR-02",
    district_name: "NCR District 2",
    manager_id: "U-006",
    manager_name: "Pedro Villanueva",
    street_address: "Lot 5, Block 3, FTI Industrial Complex",
    barangay: "Western Bicutan",
    city_municipality: "Taguig City",
    province: "Metro Manila",
    zip_code: "1630",
    latitude: 14.5095,
    longitude: 121.0500,
    contacts: [
      makeContact("CON-014", "OFF-006", "PHONE", "+63 2 8555 9012", "Warehouse Main", true, 1),
      makeContact("CON-015", "OFF-006", "MOBILE", "+63 906 222 3456", "Dispatch", false, 2),
    ],
    operating_hours: "Mon-Sat 6:00 AM - 10:00 PM",
    capacity: 200,
    notes: "Loading dock access from Gate 3. CCTV monitored 24/7.",
    opened_date: "2026-01-20",
    closed_date: null,
    data_classification: "internal",
    staff_count: 8,
    resource_count: 6,
    campaign_count: 3,
    created_by: "U-001",
    created_at: "2026-01-20T08:00:00.000Z",
    updated_at: null,
  },
  {
    id: "OFF-007",
    office_name: "Isabela Contact Point",
    office_code: "ISA-CP-001",
    office_type: "CONTACT_POINT",
    status: "PLANNED",
    description: "Planned contact point for Isabela province outreach. Awaiting local coordinator assignment.",
    capabilities: ["voter-registration"],
    district_id: "D-R2-01",
    district_name: "Isabela 1st District",
    manager_id: null,
    manager_name: null,
    street_address: "Municipal Hall Annex, Rizal Street",
    barangay: "Centro",
    city_municipality: "Ilagan City",
    province: "Isabela",
    zip_code: "3300",
    latitude: 17.1484,
    longitude: 121.8893,
    contacts: [],
    operating_hours: null,
    capacity: 10,
    notes: "Pending approval from municipal government.",
    opened_date: null,
    closed_date: null,
    data_classification: "internal",
    staff_count: 0,
    resource_count: 0,
    campaign_count: 0,
    created_by: "U-001",
    created_at: "2026-04-01T08:00:00.000Z",
    updated_at: null,
  },
  {
    id: "OFF-008",
    office_name: "Palawan Outreach Center",
    office_code: "PAL-OC-001",
    office_type: "OTHER",
    status: "INACTIVE",
    description: "Previously used outreach center for Palawan province. Operations suspended pending budget review.",
    capabilities: ["events"],
    district_id: "D-R4B-01",
    district_name: "Palawan 1st District",
    manager_id: "U-008",
    manager_name: "Ana Mendoza",
    street_address: "2nd Floor, Robinsons Place Palawan",
    barangay: "San Pedro",
    city_municipality: "Puerto Princesa City",
    province: "Palawan",
    zip_code: "5300",
    latitude: 9.7489,
    longitude: 118.7386,
    contacts: [
      makeContact("CON-016", "OFF-008", "MOBILE", "+63 918 444 5678", null, true, 1),
      makeContact("CON-017", "OFF-008", "EMAIL", "palawan@kampanya.ph", null, true, 2),
    ],
    operating_hours: null,
    capacity: 20,
    notes: "Lease expired March 2026. Equipment stored at NCR Warehouse.",
    opened_date: "2026-02-01",
    closed_date: "2026-03-31",
    data_classification: "internal",
    staff_count: 0,
    resource_count: 0,
    campaign_count: 1,
    created_by: "U-001",
    created_at: "2026-02-01T08:00:00.000Z",
    updated_at: "2026-03-31T17:00:00.000Z",
  },
];

// ─── Campaign Links ──────────────────────────────────────────────────────────

let campaignLinks: CampaignOfficeLink[] = [
  { id: "CL-001", campaign_id: "101", campaign_name: "Metro Election 2026", office_id: "OFF-001", is_primary_hq: true, linked_at: "2026-01-15T08:00:00.000Z", linked_by: "U-001", notes: "National HQ serves as primary command center" },
  { id: "CL-002", campaign_id: "101", campaign_name: "Metro Election 2026", office_id: "OFF-002", is_primary_hq: false, linked_at: "2026-02-01T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-003", campaign_id: "101", campaign_name: "Metro Election 2026", office_id: "OFF-004", is_primary_hq: false, linked_at: "2026-03-01T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-004", campaign_id: "101", campaign_name: "Metro Election 2026", office_id: "OFF-005", is_primary_hq: false, linked_at: "2026-03-15T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-005", campaign_id: "202", campaign_name: "Consumer Growth Sprint", office_id: "OFF-001", is_primary_hq: true, linked_at: "2026-01-20T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-006", campaign_id: "202", campaign_name: "Consumer Growth Sprint", office_id: "OFF-003", is_primary_hq: false, linked_at: "2026-02-15T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-007", campaign_id: "203", campaign_name: "Public Service Pilot", office_id: "OFF-001", is_primary_hq: true, linked_at: "2026-02-01T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-008", campaign_id: "203", campaign_name: "Public Service Pilot", office_id: "OFF-006", is_primary_hq: false, linked_at: "2026-02-01T08:00:00.000Z", linked_by: "U-001", notes: null },
  { id: "CL-009", campaign_id: "101", campaign_name: "Metro Election 2026", office_id: "OFF-008", is_primary_hq: false, linked_at: "2026-02-05T08:00:00.000Z", linked_by: "U-001", notes: "Palawan outreach" },
];

// ─── Staff Assignments ───────────────────────────────────────────────────────

let staffAssignments: OfficeStaffAssignment[] = [
  { id: "SA-001", office_id: "OFF-001", user_id: "U-001", user_name: "Juan dela Cruz", role: "Office Manager", assigned_at: "2026-01-15T08:00:00.000Z", removed_at: null, assigned_by: null },
  { id: "SA-002", office_id: "OFF-001", user_id: "U-010", user_name: "Liza Constantino", role: "Admin Assistant", assigned_at: "2026-01-15T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-003", office_id: "OFF-001", user_id: "U-011", user_name: "Mark Bautista", role: "Field Coordinator", assigned_at: "2026-01-20T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-004", office_id: "OFF-001", user_id: "U-012", user_name: "Sarah Aquino", role: "Comms Officer", assigned_at: "2026-02-01T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-005", office_id: "OFF-002", user_id: "U-002", user_name: "Maria Santos", role: "Regional Head", assigned_at: "2026-02-01T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-006", office_id: "OFF-002", user_id: "U-013", user_name: "Andres Lim", role: "Field Volunteer", assigned_at: "2026-02-10T08:00:00.000Z", removed_at: null, assigned_by: "U-002" },
  { id: "SA-007", office_id: "OFF-003", user_id: "U-003", user_name: "Roberto Reyes", role: "Branch Head", assigned_at: "2026-02-15T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-008", office_id: "OFF-003", user_id: "U-014", user_name: "Carmela Tan", role: "Logistics Coordinator", assigned_at: "2026-02-20T08:00:00.000Z", removed_at: null, assigned_by: "U-003" },
  { id: "SA-009", office_id: "OFF-004", user_id: "U-004", user_name: "Elena Garcia", role: "Regional Head", assigned_at: "2026-03-01T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-010", office_id: "OFF-004", user_id: "U-015", user_name: "Dennis Ong", role: "Media Liaison", assigned_at: "2026-03-05T08:00:00.000Z", removed_at: null, assigned_by: "U-004" },
  { id: "SA-011", office_id: "OFF-005", user_id: "U-005", user_name: "Ahmed Ramos", role: "Site Lead", assigned_at: "2026-03-15T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-012", office_id: "OFF-006", user_id: "U-006", user_name: "Pedro Villanueva", role: "Warehouse Manager", assigned_at: "2026-01-20T08:00:00.000Z", removed_at: null, assigned_by: "U-001" },
  { id: "SA-013", office_id: "OFF-006", user_id: "U-016", user_name: "Raul Fernandez", role: "Logistics Staff", assigned_at: "2026-01-25T08:00:00.000Z", removed_at: null, assigned_by: "U-006" },
];

// ─── Demo office functions ───────────────────────────────────────────────────

export function listDemoOffices(params: OfficesQueryParams = {}): PaginatedOffices {
  let filtered = offices.slice();
  if (params.status) filtered = filtered.filter((o) => o.status === params.status);
  if (params.office_type) filtered = filtered.filter((o) => o.office_type === params.office_type);
  if (params.province) filtered = filtered.filter((o) => o.province === params.province);
  if (params.city) filtered = filtered.filter((o) => o.city_municipality === params.city);
  if (params.district_id) filtered = filtered.filter((o) => o.district_id === params.district_id);
  if (params.manager_id) filtered = filtered.filter((o) => o.manager_id === params.manager_id);
  if (params.capability) {
    const cap = params.capability.toLowerCase();
    filtered = filtered.filter((o) => o.capabilities.some((c) => c.toLowerCase().includes(cap)));
  }
  if (params.campaign_id) {
    const linkedIds = new Set(campaignLinks.filter((cl) => cl.campaign_id === params.campaign_id).map((cl) => cl.office_id));
    filtered = filtered.filter((o) => linkedIds.has(o.id));
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((o) =>
      o.office_name.toLowerCase().includes(q) ||
      (o.office_code?.toLowerCase().includes(q) ?? false) ||
      (o.city_municipality?.toLowerCase().includes(q) ?? false) ||
      (o.province?.toLowerCase().includes(q) ?? false)
    );
  }
  const skip = params.skip ?? 0;
  const limit = params.limit ?? 20;
  return { items: filtered.slice(skip, skip + limit), total: filtered.length, skip, limit };
}

export function getDemoOffice(id: string): Office {
  const office = offices.find((o) => o.id === id);
  if (!office) throw new Error("Office not found");
  return office;
}

export function createDemoOffice(payload: OfficeCreatePayload): { message: string; data: Office } {
  const office: Office = {
    id: genId("OFF"),
    office_name: payload.office_name,
    office_code: payload.office_code ?? null,
    office_type: payload.office_type,
    status: payload.status ?? "PLANNED",
    description: payload.description ?? null,
    capabilities: payload.capabilities ?? [],
    district_id: payload.district_id ?? null,
    district_name: null,
    manager_id: payload.manager_id ?? null,
    manager_name: null,
    street_address: payload.street_address ?? null,
    barangay: payload.barangay ?? null,
    city_municipality: payload.city_municipality ?? null,
    province: payload.province ?? null,
    zip_code: payload.zip_code ?? null,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    contacts: [],
    operating_hours: payload.operating_hours ?? null,
    capacity: payload.capacity ?? null,
    notes: payload.notes ?? null,
    opened_date: payload.opened_date ?? null,
    closed_date: null,
    data_classification: payload.data_classification ?? "internal",
    staff_count: 0,
    resource_count: 0,
    campaign_count: 0,
    created_by: "U-001",
    created_at: nowIso(),
    updated_at: null,
  };
  offices = [office, ...offices];
  return { message: "Office created", data: office };
}

export function updateDemoOffice(id: string, payload: OfficeUpdatePayload): { message: string; data: Office } {
  const idx = offices.findIndex((o) => o.id === id);
  if (idx < 0) throw new Error("Office not found");
  const updated = { ...offices[idx], ...payload, updated_at: nowIso() } as Office;
  offices[idx] = updated;
  return { message: "Office updated", data: updated };
}

export function deleteDemoOffice(id: string): void {
  const idx = offices.findIndex((o) => o.id === id);
  if (idx < 0) throw new Error("Office not found");
  offices[idx] = { ...offices[idx], status: "ARCHIVED", updated_at: nowIso() };
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export function listDemoOfficeContacts(officeId: string): OfficeContact[] {
  const office = offices.find((o) => o.id === officeId);
  return office?.contacts ?? [];
}

export function createDemoOfficeContact(officeId: string, payload: ContactCreatePayload): { message: string; data: OfficeContact } {
  const office = offices.find((o) => o.id === officeId);
  if (!office) throw new Error("Office not found");
  const contact: OfficeContact = {
    id: genId("CON"),
    office_id: officeId,
    contact_type: payload.contact_type,
    value: payload.value,
    label: payload.label ?? null,
    is_primary: payload.is_primary ?? false,
    sort_order: payload.sort_order ?? office.contacts.length + 1,
    created_at: nowIso(),
    updated_at: null,
  };
  office.contacts.push(contact);
  return { message: "Contact created", data: contact };
}

export function updateDemoOfficeContact(officeId: string, contactId: string, payload: ContactUpdatePayload): { message: string; data: OfficeContact } {
  const office = offices.find((o) => o.id === officeId);
  if (!office) throw new Error("Office not found");
  const idx = office.contacts.findIndex((c) => c.id === contactId);
  if (idx < 0) throw new Error("Contact not found");
  const updated = { ...office.contacts[idx], ...payload, updated_at: nowIso() } as OfficeContact;
  office.contacts[idx] = updated;
  return { message: "Contact updated", data: updated };
}

export function deleteDemoOfficeContact(officeId: string, contactId: string): void {
  const office = offices.find((o) => o.id === officeId);
  if (!office) throw new Error("Office not found");
  office.contacts = office.contacts.filter((c) => c.id !== contactId);
}

export function setDemoPrimaryContact(officeId: string, contactId: string): OfficeContact {
  const office = offices.find((o) => o.id === officeId);
  if (!office) throw new Error("Office not found");
  const contact = office.contacts.find((c) => c.id === contactId);
  if (!contact) throw new Error("Contact not found");
  // Clear other primaries of same type
  for (const c of office.contacts) {
    if (c.contact_type === contact.contact_type) c.is_primary = false;
  }
  contact.is_primary = true;
  return contact;
}

// ─── Campaign Links ──────────────────────────────────────────────────────────

export function listDemoOfficeCampaigns(officeId: string): CampaignOfficeLink[] {
  return campaignLinks.filter((cl) => cl.office_id === officeId);
}

export function linkDemoOfficeToCampaign(officeId: string, payload: CampaignOfficeLinkPayload): { message: string; data: CampaignOfficeLink } {
  const link: CampaignOfficeLink = {
    id: genId("CL"),
    campaign_id: payload.campaign_id,
    campaign_name: "Demo Campaign",
    office_id: officeId,
    is_primary_hq: payload.is_primary_hq ?? false,
    linked_at: nowIso(),
    linked_by: "U-001",
    notes: payload.notes ?? null,
  };
  campaignLinks.push(link);
  return { message: "Campaign linked", data: link };
}

export function unlinkDemoOfficeFromCampaign(officeId: string, campaignId: string): void {
  campaignLinks = campaignLinks.filter((cl) => !(cl.office_id === officeId && cl.campaign_id === campaignId));
}

// ─── Staff ───────────────────────────────────────────────────────────────────

export function listDemoOfficeStaff(officeId: string): OfficeStaffAssignment[] {
  return staffAssignments.filter((s) => s.office_id === officeId && s.removed_at === null);
}

export function assignDemoStaff(officeId: string, payload: StaffAssignPayload): { message: string; data: OfficeStaffAssignment } {
  const assignment: OfficeStaffAssignment = {
    id: genId("SA"),
    office_id: officeId,
    user_id: payload.user_id,
    user_name: "Demo User",
    role: payload.role ?? null,
    assigned_at: nowIso(),
    removed_at: null,
    assigned_by: "U-001",
  };
  staffAssignments.push(assignment);
  return { message: "Staff assigned", data: assignment };
}

export function updateDemoStaffRole(officeId: string, userId: string, payload: StaffRoleUpdatePayload): { message: string; data: OfficeStaffAssignment } {
  const idx = staffAssignments.findIndex((s) => s.office_id === officeId && s.user_id === userId && s.removed_at === null);
  if (idx < 0) throw new Error("Staff assignment not found");
  staffAssignments[idx] = { ...staffAssignments[idx], role: payload.role ?? null };
  return { message: "Role updated", data: staffAssignments[idx] };
}

export function removeDemoStaff(officeId: string, userId: string): void {
  const idx = staffAssignments.findIndex((s) => s.office_id === officeId && s.user_id === userId && s.removed_at === null);
  if (idx < 0) throw new Error("Staff assignment not found");
  staffAssignments[idx] = { ...staffAssignments[idx], removed_at: nowIso() };
}

// ─── Office Resources (delegates to resource demo data) ──────────────────────

export function listDemoOfficeResourcesPlaceholder(_officeId: string): Resource[] {
  // Actual implementation deferred to resources/demoData.ts to avoid circular deps;
  // the officeApi will call it from there.
  return [];
}

// ─── Helper for OfficeSuggest ────────────────────────────────────────────────

export function getDemoOfficeSuggestItems(): Array<{ id: string; office_name: string; office_code: string | null; office_type: string; city_municipality: string | null }> {
  return offices.map((o) => ({
    id: o.id,
    office_name: o.office_name,
    office_code: o.office_code,
    office_type: o.office_type,
    city_municipality: o.city_municipality,
  }));
}
