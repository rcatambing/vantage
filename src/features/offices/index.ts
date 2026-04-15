// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  Office,
  OfficeContact,
  CampaignOfficeLink,
  OfficeStaffAssignment,
  OfficeType,
  OfficeStatus,
  ContactChannelType,
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

export {
  OFFICE_STATUS_INTENT,
  OFFICE_STATUS_LABEL,
  OFFICE_TYPE_LABEL,
  CONTACT_CHANNEL_ICON,
  CONTACT_CHANNEL_LABEL,
  ACTIVE_OFFICE_STATUSES,
} from "./types";

// ─── API ─────────────────────────────────────────────────────────────────────
export {
  listOffices,
  getOffice,
  createOffice,
  updateOffice,
  deleteOffice,
  listOfficeContacts,
  createOfficeContact,
  updateOfficeContact,
  deleteOfficeContact,
  setPrimaryContact,
  listOfficeCampaigns,
  linkOfficeToCampaign,
  unlinkOfficeFromCampaign,
  listOfficeStaff,
  assignStaff,
  updateStaffRole,
  removeStaff,
} from "./api/officeApi";

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useOfficeList } from "./hooks/useOfficeList";
export { useOffice } from "./hooks/useOffice";
export { useOfficeMutations } from "./hooks/useOfficeMutations";
export { useOfficeContacts } from "./hooks/useOfficeContacts";
export { useOfficeContactMutations } from "./hooks/useOfficeContactMutations";
export { useOfficeStaff } from "./hooks/useOfficeStaff";
export { useOfficeStaffMutations } from "./hooks/useOfficeStaffMutations";

// ─── Components ──────────────────────────────────────────────────────────────
export { OfficeStatusTag } from "./components/OfficeStatusTag";
export { OfficeTypeBadge } from "./components/OfficeTypeBadge";
export { OfficeAddress } from "./components/OfficeAddress";
export { DescriptionRenderer } from "./components/DescriptionRenderer";
export { CapabilitiesTagInput } from "./components/CapabilitiesTagInput";
export { OfficeFilterBar } from "./components/OfficeFilterBar";
export { OfficeListTable } from "./components/OfficeListTable";
export { default as OfficesPage } from "./components/OfficesPage";
export { OfficeCreateDialog } from "./components/OfficeCreateDialog";
export { OfficeEditDrawer } from "./components/OfficeEditDrawer";
export { default as OfficeDetailPage } from "./components/OfficeDetailPage";
export { OfficeContactsPanel } from "./components/OfficeContactsPanel";
export { ContactCreateDialog } from "./components/ContactCreateDialog";
export { CampaignLinksPanel } from "./components/CampaignLinksPanel";
export { OfficeStaffPanel } from "./components/OfficeStaffPanel";
export { AssignStaffDialog } from "./components/AssignStaffDialog";
export { OfficeResourcesPanel } from "./components/OfficeResourcesPanel";
