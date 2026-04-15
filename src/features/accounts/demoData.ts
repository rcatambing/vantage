import type { CampaignType } from "../campaigns/types";
import type {
  AccountAffiliation,
  AffiliationRef,
  AffiliationTypeRef,
  AccountAffiliationCreatePayload,
  AccountAffiliationUpdatePayload,
  AccountCreatePayload,
  AccountSignal,
  AccountSignalCreatePayload,
  SignalTypeRef,
  AccountSignalUpdatePayload,
  AccountUpdatePayload,
  AccountsQueryParams,
  CommunityLeader,
  CustomerAccount,
  LeaderCreatePayload,
  LeaderEngagementEvent,
  LeadersQueryParams,
  LeaderUpdatePayload,
  PaginatedAccounts,
  PaginatedLeaders,
  PaginatedAccountSignals,
  AddEngagementPayload,
} from "./types";

const nowIso = () => new Date().toISOString();

export const DEMO_CAMPAIGNS: Array<{ id: string; campaign_type: CampaignType; name: string }> = [
  { id: "101", campaign_type: "ELECTION", name: "Metro Election 2026" },
  { id: "202", campaign_type: "OPERATIONS", name: "Consumer Growth Sprint" },
  { id: "203", campaign_type: "SPECIAL_PROJECT", name: "Public Service Pilot" },
];

let leaders: CommunityLeader[] = [
  {
    id: "L-001",
    campaign_id: "101",
    full_name: "Maria Santos",
    organization: "Barangay Women Federation",
    affiliation: "Civic",
    influence_level: "KEY_INFLUENCER",
    support_status: "SUPPORTER",
    status: "ACTIVE",
    district_id: "D-01",
    district_name: "District 1",
    relationship_owner_id: "12",
    has_contact: true,
    notes: "Strong mobilizer for community outreach events.",
    created_at: "2026-03-10T09:00:00.000Z",
    updated_at: "2026-04-01T10:10:00.000Z",
  },
  {
    id: "L-002",
    campaign_id: "101",
    full_name: "Rogelio Cruz",
    organization: "Transport Coalition",
    affiliation: "Sectoral",
    influence_level: "HIGH",
    support_status: "UNDECIDED",
    status: "ACTIVE",
    district_id: "D-02",
    district_name: "District 2",
    relationship_owner_id: "15",
    has_contact: true,
    notes: "Needs follow-up after policy roundtable.",
    created_at: "2026-03-12T11:30:00.000Z",
    updated_at: "2026-04-02T08:30:00.000Z",
  },
  {
    id: "L-003",
    campaign_id: "101",
    full_name: "Elena Ramirez",
    organization: "Parent Leaders Council",
    affiliation: "Education",
    influence_level: "MEDIUM",
    support_status: "NEUTRAL",
    status: "ACTIVE",
    district_id: "D-03",
    district_name: "District 3",
    relationship_owner_id: null,
    has_contact: false,
    notes: null,
    created_at: "2026-03-14T07:15:00.000Z",
    updated_at: null,
  },
];

let engagements: LeaderEngagementEvent[] = [
  {
    id: "E-001",
    leader_id: "L-001",
    event_type: "MEETING",
    description: "Aligned on election-day volunteer deployment.",
    occurred_at: "2026-04-02T09:00:00.000Z",
    recorded_by: "12",
    recorded_by_name: "Field Director",
  },
  {
    id: "E-002",
    leader_id: "L-001",
    event_type: "COMMITMENT",
    description: "Committed 20 volunteers for barangay outreach.",
    occurred_at: "2026-04-04T10:15:00.000Z",
    recorded_by: "12",
    recorded_by_name: "Field Director",
  },
  {
    id: "E-003",
    leader_id: "L-002",
    event_type: "ISSUE",
    description: "Requested clarifications on transport subsidy policy.",
    occurred_at: "2026-04-05T14:45:00.000Z",
    recorded_by: "15",
    recorded_by_name: "Operations Lead",
  },
];

let accounts: CustomerAccount[] = [
  {
    id: "A-001",
    campaign_id: "202",
    account_name: "Northstar Retail Group",
    segment: "MID_MARKET",
    district_id: "D-11",
    district_name: "Commercial North",
    primary_contact_name: "Ana Velasco",
    has_contact: true,
    status: "ACTIVE",
    owner_id: "22",
    notes: "Interested in seasonal campaign bundle.",
    created_at: "2026-03-08T08:00:00.000Z",
    updated_at: "2026-04-01T12:00:00.000Z",
  },
  {
    id: "A-002",
    campaign_id: "202",
    account_name: "Summit Health Network",
    segment: "ENTERPRISE",
    district_id: "D-12",
    district_name: "Medical Zone",
    primary_contact_name: "Mika Dizon",
    has_contact: true,
    status: "PROSPECT",
    owner_id: "24",
    notes: "Needs legal review before final quote.",
    created_at: "2026-03-15T10:20:00.000Z",
    updated_at: null,
  },
  {
    id: "A-003",
    campaign_id: "203",
    account_name: "City Aid Foundation",
    segment: "NGO",
    district_id: "D-21",
    district_name: "Civic South",
    primary_contact_name: null,
    has_contact: false,
    status: "ACTIVE",
    owner_id: "26",
    notes: "Pilot-phase partner for special project outreach.",
    created_at: "2026-03-20T13:00:00.000Z",
    updated_at: "2026-04-03T09:00:00.000Z",
  },
];

const affiliationTypes: AffiliationTypeRef[] = [
  { id: "AT-01", code: "INDUSTRY", name: "Industry" },
  { id: "AT-02", code: "FAMILY", name: "Family" },
  { id: "AT-03", code: "RELIGION", name: "Religion" },
];

const affiliationsCatalog: AffiliationRef[] = [
  { id: "AF-100", affiliation_type_id: "AT-01", code: "MRA", name: "Metro Retail Alliance" },
  { id: "AF-200", affiliation_type_id: "AT-02", code: "FBF", name: "Family Business Federation" },
  { id: "AF-300", affiliation_type_id: "AT-01", code: "HSC", name: "Health Sector Consortium" },
  { id: "AF-400", affiliation_type_id: "AT-03", code: "RC", name: "Roman Catholic" },
];

const signalTypes: SignalTypeRef[] = [
  { id: "ST-10", code: "FAMILY", name: "Family Network" },
  { id: "ST-20", code: "LOYALTY", name: "Brand Loyalty" },
  { id: "ST-30", code: "INDUSTRY", name: "Industry Affiliation" },
  { id: "ST-40", code: "RELIGION", name: "Religious Alignment" },
];

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function paginate<T>(items: T[], page = 1, pageSize = 25): { items: T[]; total: number; page: number; page_size: number } {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    page_size: pageSize,
  };
}

export function isDemoModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const qs = new URLSearchParams(window.location.search);
  return qs.get("demo") === "1" || window.localStorage.getItem("vantage.demoData") === "1";
}

export function getDemoCampaignType(campaignId: string | number | undefined): CampaignType | null {
  const id = String(campaignId ?? "");
  const campaign = DEMO_CAMPAIGNS.find((c) => c.id === id);
  return campaign?.campaign_type ?? null;
}

export function listDemoLeaders(params: LeadersQueryParams = {}): PaginatedLeaders {
  const filtered = leaders.filter((l) => {
    if (params.campaign_id && l.campaign_id !== String(params.campaign_id)) return false;
    if (params.influence_level && l.influence_level !== params.influence_level) return false;
    if (params.support_status && l.support_status !== params.support_status) return false;
    if (params.district_id && l.district_id !== String(params.district_id)) return false;
    if (params.relationship_owner_id && l.relationship_owner_id !== String(params.relationship_owner_id)) return false;
    if (params.search && !l.full_name.toLowerCase().includes(params.search.toLowerCase())) return false;
    return true;
  });
  return paginate(filtered, params.page ?? 1, params.page_size ?? 25);
}

export function getDemoLeader(id: string): CommunityLeader {
  const leader = leaders.find((l) => l.id === id);
  if (!leader) throw new Error("Leader not found");
  return leader;
}

export function createDemoLeader(payload: LeaderCreatePayload): { message: string; data: CommunityLeader } {
  const newLeader: CommunityLeader = {
    id: `L-${String(leaders.length + 1).padStart(3, "0")}`,
    campaign_id: String(payload.campaign_id),
    full_name: payload.full_name,
    organization: payload.organization ?? null,
    affiliation: payload.affiliation ?? null,
    influence_level: payload.influence_level,
    support_status: payload.support_status ?? "UNKNOWN",
    status: "ACTIVE",
    district_id: payload.district_id ?? null,
    district_name: payload.district_id ? `District ${payload.district_id}` : null,
    relationship_owner_id: payload.relationship_owner_id ?? null,
    has_contact: Boolean(payload.relationship_owner_id),
    notes: payload.notes ?? null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  leaders = [newLeader, ...leaders];
  return { message: "Leader created", data: newLeader };
}

export function updateDemoLeader(id: string, payload: LeaderUpdatePayload): { message: string; data: CommunityLeader } {
  const idx = leaders.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Leader not found");
  const updated: CommunityLeader = {
    ...leaders[idx],
    ...payload,
    district_name: payload.district_id ? `District ${payload.district_id}` : leaders[idx].district_name,
    has_contact: payload.relationship_owner_id ? true : leaders[idx].has_contact,
    updated_at: nowIso(),
  };
  leaders[idx] = updated;
  return { message: "Leader updated", data: updated };
}

export function deleteDemoLeader(id: string): void {
  leaders = leaders.map((l) => (l.id === id ? { ...l, status: "ARCHIVED", updated_at: nowIso() } : l));
}

export function listDemoEngagement(leaderId: string): LeaderEngagementEvent[] {
  return engagements
    .filter((e) => e.leader_id === leaderId)
    .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());
}

export function addDemoEngagement(leaderId: string, payload: AddEngagementPayload): { message: string; data: LeaderEngagementEvent } {
  const event: LeaderEngagementEvent = {
    id: `E-${String(engagements.length + 1).padStart(3, "0")}`,
    leader_id: leaderId,
    event_type: payload.event_type,
    description: payload.description,
    occurred_at: payload.occurred_at ?? nowIso(),
    recorded_by: "1",
    recorded_by_name: "Demo User",
  };
  engagements = [event, ...engagements];
  return { message: "Engagement created", data: event };
}

export function listDemoAccounts(params: AccountsQueryParams = {}): PaginatedAccounts {
  const filtered = accounts.filter((a) => {
    if (params.campaign_id && a.campaign_id !== String(params.campaign_id)) return false;
    if (params.segment && a.segment !== params.segment) return false;
    if (params.status && a.status !== params.status) return false;
    if (params.district_id && a.district_id !== String(params.district_id)) return false;
    if (params.owner_id && a.owner_id !== String(params.owner_id)) return false;
    if (params.search && !a.account_name.toLowerCase().includes(params.search.toLowerCase())) return false;
    if (params.affiliation_type_id) {
      const hasType = accountAffiliations.some(
        (aff) => aff.account_id === a.id && aff.affiliation_type_id === params.affiliation_type_id
      );
      if (!hasType) return false;
    }
    if (params.affiliation_id) {
      const hasAffiliation = accountAffiliations.some(
        (aff) => aff.account_id === a.id && aff.affiliation_id === params.affiliation_id
      );
      if (!hasAffiliation) return false;
    }
    if (params.signal_type_id) {
      const hasSignalType = accountSignals.some(
        (sig) => sig.account_id === a.id && sig.signal_type_id === params.signal_type_id
      );
      if (!hasSignalType) return false;
    }
    return true;
  });
  return paginate(filtered, params.page ?? 1, params.page_size ?? 25);
}

export function listDemoAffiliationTypes(): AffiliationTypeRef[] {
  return affiliationTypes;
}

export function listDemoAffiliations(affiliationTypeId?: string): AffiliationRef[] {
  if (!affiliationTypeId) return affiliationsCatalog;
  return affiliationsCatalog.filter((item) => item.affiliation_type_id === affiliationTypeId);
}

export function listDemoSignalTypes(): SignalTypeRef[] {
  return signalTypes;
}

export function getDemoAccount(id: string): CustomerAccount {
  const account = accounts.find((a) => a.id === id);
  if (!account) throw new Error("Account not found");
  return account;
}

export function createDemoAccount(payload: AccountCreatePayload): { message: string; data: CustomerAccount } {
  const created: CustomerAccount = {
    id: `A-${String(accounts.length + 1).padStart(3, "0")}`,
    campaign_id: String(payload.campaign_id),
    account_name: payload.account_name,
    segment: payload.segment ?? null,
    district_id: payload.district_id ?? null,
    district_name: payload.district_id ? `District ${payload.district_id}` : null,
    primary_contact_name: payload.primary_contact_name ?? null,
    has_contact: Boolean(payload.primary_contact_name),
    status: "PROSPECT",
    owner_id: payload.owner_id ?? null,
    notes: payload.notes ?? null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  accounts = [created, ...accounts];
  return { message: "Account created", data: created };
}

export function updateDemoAccount(id: string, payload: AccountUpdatePayload): { message: string; data: CustomerAccount } {
  const idx = accounts.findIndex((a) => a.id === id);
  if (idx < 0) throw new Error("Account not found");
  const updated: CustomerAccount = {
    ...accounts[idx],
    ...payload,
    district_name: payload.district_id ? `District ${payload.district_id}` : accounts[idx].district_name,
    has_contact: payload.primary_contact_name ? true : accounts[idx].has_contact,
    updated_at: nowIso(),
  };
  accounts[idx] = updated;
  return { message: "Account updated", data: updated };
}

export function deleteDemoAccount(id: string): void {
  accounts = accounts.map((a) => (a.id === id ? { ...a, status: "INACTIVE", updated_at: nowIso() } : a));
}

// ─── Account Affiliations ─────────────────────────────────────────────────────

let accountAffiliations: AccountAffiliation[] = [
  {
    id: "AA-001",
    account_id: "A-001",
    affiliation_id: "AF-100",
    affiliation_name: "Metro Retail Alliance",
    affiliation_type_id: "AT-01",
    affiliation_type_code: "INDUSTRY",
    role_in_affiliation: "Member",
    affinity_score: 78,
    is_primary: true,
    start_date: "2025-01-15",
    end_date: null,
    source: "MANUAL",
  },
  {
    id: "AA-002",
    account_id: "A-001",
    affiliation_id: "AF-200",
    affiliation_name: "Family Business Federation",
    affiliation_type_id: "AT-02",
    affiliation_type_code: "FAMILY",
    role_in_affiliation: "Partner",
    affinity_score: 65,
    is_primary: false,
    start_date: "2025-06-01",
    end_date: null,
    source: "FIELD_SURVEY",
  },
  {
    id: "AA-003",
    account_id: "A-002",
    affiliation_id: "AF-300",
    affiliation_name: "Health Sector Consortium",
    affiliation_type_id: "AT-01",
    affiliation_type_code: "INDUSTRY",
    role_in_affiliation: "Associate",
    affinity_score: 55,
    is_primary: true,
    start_date: "2025-03-10",
    end_date: null,
    source: "MANUAL",
  },
];

export function listDemoAccountAffiliations(
  accountId: string,
  params: { affiliation_type_code?: string; active_only?: boolean } = {}
): AccountAffiliation[] {
  return accountAffiliations.filter((a) => {
    if (a.account_id !== accountId) return false;
    if (params.affiliation_type_code && a.affiliation_type_code !== params.affiliation_type_code) return false;
    if (params.active_only) {
      if (a.end_date && new Date(a.end_date) <= new Date()) return false;
    }
    return true;
  });
}

export function createDemoAccountAffiliation(
  accountId: string,
  payload: AccountAffiliationCreatePayload
): { message: string; data: AccountAffiliation } {
  const affiliation = affiliationsCatalog.find((item) => item.id === payload.affiliation_id);
  const affiliationType = affiliationTypes.find((item) => item.id === affiliation?.affiliation_type_id);
  const created: AccountAffiliation = {
    id: `AA-${String(accountAffiliations.length + 1).padStart(3, "0")}`,
    account_id: accountId,
    affiliation_id: payload.affiliation_id,
    affiliation_name: affiliation?.name ?? `Affiliation ${payload.affiliation_id}`,
    affiliation_type_id: affiliationType?.id ?? "AT-99",
    affiliation_type_code: affiliationType?.code ?? "MANUAL",
    role_in_affiliation: payload.role_in_affiliation ?? null,
    affinity_score: payload.affinity_score ?? null,
    is_primary: payload.is_primary ?? false,
    start_date: payload.start_date ?? new Date().toISOString().slice(0, 10),
    end_date: null,
    source: payload.source ?? "MANUAL",
  };
  accountAffiliations = [created, ...accountAffiliations];
  return { message: "Affiliation assigned", data: created };
}

export function updateDemoAccountAffiliation(
  accountId: string,
  id: string,
  payload: AccountAffiliationUpdatePayload
): { message: string; data: AccountAffiliation } {
  const idx = accountAffiliations.findIndex((a) => a.id === id && a.account_id === accountId);
  if (idx < 0) throw new Error("Affiliation not found");
  const updated: AccountAffiliation = { ...accountAffiliations[idx], ...payload };
  accountAffiliations[idx] = updated;
  return { message: "Affiliation updated", data: updated };
}

export function deleteDemoAccountAffiliation(accountId: string, id: string): void {
  const now = new Date().toISOString();
  const row = accountAffiliations.find((a) => a.id === id && a.account_id === accountId);
  accountAffiliations = accountAffiliations.map((a) =>
    a.id === id && a.account_id === accountId
      ? { ...a, end_date: now.slice(0, 10) }
      : a
  );

  if (!row) return;

  accountSignals = accountSignals.map((s) => {
    const isLinkedDerived =
      s.account_id === accountId &&
      s.derived_from_affiliation_id != null &&
      s.derived_from_affiliation_id === row.id &&
      s.expires_at == null;

    return isLinkedDerived ? { ...s, expires_at: now } : s;
  });
}

// ─── Account Signals ─────────────────────────────────────────────────────────

let accountSignals: AccountSignal[] = [
  {
    id: "AS-001",
    account_id: "A-001",
    signal_type_id: "ST-10",
    signal_type_code: "FAMILY",
    signal_type_name: "Family Network",
    derived_from_affiliation_id: "AA-002",
    intensity_score: 75,
    confidence_score: 80,
    observed_at: "2025-06-01T00:00:00.000Z",
    expires_at: null,
    source: "AFFILIATION_DERIVED",
    notes: null,
    params: [
      {
        id: "ASP-001",
        account_signal_id: "AS-001",
        param_key: "channel",
        param_value_text: "distributor",
        param_value_number: null,
        param_value_bool: null,
        unit: null,
      },
      {
        id: "ASP-002",
        account_signal_id: "AS-001",
        param_key: "tenure_years",
        param_value_text: null,
        param_value_number: 8,
        param_value_bool: null,
        unit: "years",
      },
    ],
  },
  {
    id: "AS-002",
    account_id: "A-001",
    signal_type_id: "ST-20",
    signal_type_code: "LOYALTY",
    signal_type_name: "Brand Loyalty",
    derived_from_affiliation_id: null,
    intensity_score: 60,
    confidence_score: 55,
    observed_at: "2026-01-05T00:00:00.000Z",
    expires_at: null,
    source: "FIELD_SURVEY",
    notes: "Noted preference for premium pricing tier.",
    params: [],
  },
  {
    id: "AS-003",
    account_id: "A-002",
    signal_type_id: "ST-30",
    signal_type_code: "INDUSTRY",
    signal_type_name: "Industry Affiliation",
    derived_from_affiliation_id: "AA-003",
    intensity_score: 70,
    confidence_score: 75,
    observed_at: "2025-03-10T00:00:00.000Z",
    expires_at: null,
    source: "AFFILIATION_DERIVED",
    notes: null,
    params: [],
  },
];

const DEMO_BASELINE = {
  leaders: deepClone(leaders),
  engagements: deepClone(engagements),
  accounts: deepClone(accounts),
  accountAffiliations: deepClone(accountAffiliations),
  accountSignals: deepClone(accountSignals),
};

export function setDemoModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    window.localStorage.setItem("vantage.demoData", "1");
  } else {
    window.localStorage.removeItem("vantage.demoData");
  }
}

export function resetDemoData(): void {
  leaders = deepClone(DEMO_BASELINE.leaders);
  engagements = deepClone(DEMO_BASELINE.engagements);
  accounts = deepClone(DEMO_BASELINE.accounts);
  accountAffiliations = deepClone(DEMO_BASELINE.accountAffiliations);
  accountSignals = deepClone(DEMO_BASELINE.accountSignals);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

export function generateDemoTestData(count = 20): {
  accountsAdded: number;
  affiliationsAdded: number;
  signalsAdded: number;
} {
  let accountsAdded = 0;
  let affiliationsAdded = 0;
  let signalsAdded = 0;

  for (let i = 0; i < count; i += 1) {
    const accountIdx = accounts.length + 1;
    const id = `A-${String(accountIdx).padStart(3, "0")}`;
    const campaignId = randomPick(["202", "203"]);
    const segment = randomPick(["ENTERPRISE", "MID_MARKET", "SMB", "GOVERNMENT", "NGO"] as const);
    const primaryContactName = randomPick(["Alex Reyes", "Mina Dela Cruz", "Jose Mercado", null]);

    const createdAccount: CustomerAccount = {
      id,
      campaign_id: campaignId,
      account_name: `Demo Account ${accountIdx}`,
      segment,
      district_id: `D-${String(randomInt(10, 29))}`,
      district_name: `District ${randomInt(1, 20)}`,
      primary_contact_name: primaryContactName,
      has_contact: primaryContactName != null,
      status: randomPick(["ACTIVE", "PROSPECT", "INACTIVE"] as const),
      owner_id: String(randomInt(20, 40)),
      notes: randomPick([
        "Auto-generated demo account for intelligence testing.",
        "Monitor support trend before outreach.",
        "Candidate for partnership sequence.",
      ]),
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    accounts.unshift(createdAccount);
    accountsAdded += 1;

    const affiliationRef = randomPick(affiliationsCatalog);
    const affiliationType = affiliationTypes.find((item) => item.id === affiliationRef.affiliation_type_id);
    const accountAffiliationId = `AA-${String(accountAffiliations.length + 1).padStart(3, "0")}`;

    const createdAffiliation: AccountAffiliation = {
      id: accountAffiliationId,
      account_id: id,
      affiliation_id: affiliationRef.id,
      affiliation_name: affiliationRef.name,
      affiliation_type_id: affiliationRef.affiliation_type_id,
      affiliation_type_code: affiliationType?.code ?? "UNKNOWN",
      role_in_affiliation: randomPick(["Member", "Partner", "Associate", null]),
      affinity_score: randomInt(40, 95),
      is_primary: true,
      start_date: new Date(Date.now() - randomInt(30, 360) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      end_date: null,
      source: randomPick(["MANUAL", "FIELD_SURVEY"]),
    };
    accountAffiliations.unshift(createdAffiliation);
    affiliationsAdded += 1;

    const signalRef = randomPick(signalTypes);
    const signalId = `AS-${String(accountSignals.length + 1).padStart(3, "0")}`;
    const derived = randomPick([true, false]);

    const createdSignal: AccountSignal = {
      id: signalId,
      account_id: id,
      signal_type_id: signalRef.id,
      signal_type_code: signalRef.code,
      signal_type_name: signalRef.name,
      derived_from_affiliation_id: derived ? createdAffiliation.id : null,
      intensity_score: randomInt(35, 92),
      confidence_score: randomInt(40, 90),
      observed_at: nowIso(),
      expires_at: null,
      source: derived ? "AFFILIATION_DERIVED" : randomPick(["FIELD_SURVEY", "ANALYST_NOTES"]),
      notes: randomPick([
        "Generated for panel stress test.",
        "Observed recent behavior change.",
        "Strong indicator in latest outreach cycle.",
      ]),
      params: [],
    };
    accountSignals.unshift(createdSignal);
    signalsAdded += 1;
  }

  return { accountsAdded, affiliationsAdded, signalsAdded };
}

export function listDemoAccountSignals(
  accountId: string,
  params: { signal_type_code?: string; active_only?: boolean; page?: number; page_size?: number } = {}
): PaginatedAccountSignals {
  const filtered = accountSignals.filter((s) => {
    if (s.account_id !== accountId) return false;
    if (params.signal_type_code && s.signal_type_code !== params.signal_type_code) return false;
    if (params.active_only) {
      if (s.expires_at && new Date(s.expires_at) <= new Date()) return false;
    }
    return true;
  });

  const page = params.page ?? 1;
  const pageSize = params.page_size ?? 25;
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    page_size: pageSize,
  };
}

export function createDemoAccountSignal(
  accountId: string,
  payload: AccountSignalCreatePayload
): { message: string; data: AccountSignal } {
  const signalType = signalTypes.find((item) => item.id === payload.signal_type_id);
  const created: AccountSignal = {
    id: `AS-${String(accountSignals.length + 1).padStart(3, "0")}`,
    account_id: accountId,
    signal_type_id: payload.signal_type_id,
    signal_type_code: signalType?.code ?? payload.signal_type_id,
    signal_type_name: signalType?.name ?? payload.signal_type_id,
    derived_from_affiliation_id: null,
    intensity_score: payload.intensity_score ?? null,
    confidence_score: payload.confidence_score ?? null,
    observed_at: payload.observed_at,
    expires_at: payload.expires_at ?? null,
    source: payload.source ?? null,
    notes: payload.notes ?? null,
    params: [],
  };
  accountSignals = [created, ...accountSignals];
  return { message: "Signal created", data: created };
}

export function updateDemoAccountSignal(
  accountId: string,
  signalId: string,
  payload: AccountSignalUpdatePayload
): { message: string; data: AccountSignal } {
  const idx = accountSignals.findIndex((s) => s.id === signalId && s.account_id === accountId);
  if (idx < 0) throw new Error("Signal not found");
  const updated: AccountSignal = { ...accountSignals[idx], ...payload };
  accountSignals[idx] = updated;
  return { message: "Signal updated", data: updated };
}

export function deleteDemoAccountSignal(accountId: string, signalId: string): void {
  accountSignals = accountSignals.filter(
    (s) => !(s.id === signalId && s.account_id === accountId)
  );
}
