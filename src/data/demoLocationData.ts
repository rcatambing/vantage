// ---------------------------------------------------------------------------
// Demo reference data for Suggest components (regions, cities, staff).
// Used when demo mode is enabled; mirrors the PH administrative hierarchy.
// ---------------------------------------------------------------------------

export interface DemoRegion {
  id: string;
  name: string;
  code: string;
}

export interface DemoCity {
  id: string;
  region_id: string;
  name: string;
}

export interface DemoStaffMember {
  id: string;
  full_name: string;
  role: string;
}

// 17 Philippine regions
export const DEMO_REGIONS: DemoRegion[] = [
  { id: "R01", name: "Ilocos Region", code: "Region I" },
  { id: "R02", name: "Cagayan Valley", code: "Region II" },
  { id: "R03", name: "Central Luzon", code: "Region III" },
  { id: "R04A", name: "CALABARZON", code: "Region IV-A" },
  { id: "R04B", name: "MIMAROPA", code: "Region IV-B" },
  { id: "R05", name: "Bicol Region", code: "Region V" },
  { id: "R06", name: "Western Visayas", code: "Region VI" },
  { id: "R07", name: "Central Visayas", code: "Region VII" },
  { id: "R08", name: "Eastern Visayas", code: "Region VIII" },
  { id: "R09", name: "Zamboanga Peninsula", code: "Region IX" },
  { id: "R10", name: "Northern Mindanao", code: "Region X" },
  { id: "R11", name: "Davao Region", code: "Region XI" },
  { id: "R12", name: "SOCCSKSARGEN", code: "Region XII" },
  { id: "R13", name: "Caraga", code: "Region XIII" },
  { id: "BARMM", name: "BARMM", code: "BARMM" },
  { id: "CAR", name: "Cordillera Admin Region", code: "CAR" },
  { id: "NCR", name: "National Capital Region", code: "NCR" },
];

// Representative cities (subset) — parent_id links to region
export const DEMO_CITIES: DemoCity[] = [
  // NCR
  { id: "C-QC", region_id: "NCR", name: "Quezon City" },
  { id: "C-MNL", region_id: "NCR", name: "Manila" },
  { id: "C-MKT", region_id: "NCR", name: "Makati" },
  { id: "C-PSG", region_id: "NCR", name: "Pasig" },
  { id: "C-TGG", region_id: "NCR", name: "Taguig" },
  { id: "C-PAR", region_id: "NCR", name: "Parañaque" },
  // Region III — Central Luzon
  { id: "C-SFC", region_id: "R03", name: "San Fernando (Pampanga)" },
  { id: "C-ANG", region_id: "R03", name: "Angeles City" },
  { id: "C-OLO", region_id: "R03", name: "Olongapo City" },
  // Region IV-A — CALABARZON
  { id: "C-ANT", region_id: "R04A", name: "Antipolo" },
  { id: "C-LPA", region_id: "R04A", name: "Lipa City" },
  { id: "C-BTG", region_id: "R04A", name: "Batangas City" },
  // Region VII — Central Visayas
  { id: "C-CEB", region_id: "R07", name: "Cebu City" },
  { id: "C-LPU", region_id: "R07", name: "Lapu-Lapu City" },
  { id: "C-MAN", region_id: "R07", name: "Mandaue City" },
  // Region XI — Davao
  { id: "C-DVO", region_id: "R11", name: "Davao City" },
  { id: "C-PAN", region_id: "R11", name: "Panabo City" },
  // Region I — Ilocos
  { id: "C-LAO", region_id: "R01", name: "Laoag City" },
  { id: "C-VGN", region_id: "R01", name: "Vigan City" },
  // Region VI — Western Visayas
  { id: "C-ILO", region_id: "R06", name: "Iloilo City" },
  { id: "C-BAC", region_id: "R06", name: "Bacolod City" },
  // Region X — Northern Mindanao
  { id: "C-CDO", region_id: "R10", name: "Cagayan de Oro" },
  // CAR
  { id: "C-BAG", region_id: "CAR", name: "Baguio City" },
  // Region V — Bicol
  { id: "C-NGA", region_id: "R05", name: "Naga City" },
  { id: "C-LGZ", region_id: "R05", name: "Legazpi City" },
];

// Staff members for UserSuggest in demo mode
export const DEMO_STAFF: DemoStaffMember[] = [
  { id: "U-001", full_name: "Maria Santos", role: "Field Director" },
  { id: "U-002", full_name: "Rogelio Cruz", role: "Operations Lead" },
  { id: "U-003", full_name: "Elena Ramirez", role: "Campaign Manager" },
  { id: "U-004", full_name: "Carlos Manalang", role: "IT Coordinator" },
  { id: "U-005", full_name: "Patricia Reyes", role: "Logistics Officer" },
  { id: "U-006", full_name: "Andres Villanueva", role: "Communications Lead" },
  { id: "U-007", full_name: "Sofia Lim", role: "Data Analyst" },
  { id: "U-008", full_name: "Roberto Aquino", role: "Regional Coordinator" },
  { id: "U-009", full_name: "Grace del Rosario", role: "Volunteer Manager" },
  { id: "U-010", full_name: "Miguel Torres", role: "Finance Officer" },
];
