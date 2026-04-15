// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  Resource,
  ResourceAssignment,
  ResourceAssignmentSummary,
  ResourceType,
  ResourceStatus,
  ResourceCondition,
  ResourceCreatePayload,
  ResourceUpdatePayload,
  ResourceAssignPayload,
  ResourceReassignPayload,
  ResourceUnassignPayload,
  ResourcesQueryParams,
  PaginatedResources,
} from "./types";

export {
  RESOURCE_STATUS_INTENT,
  RESOURCE_STATUS_LABEL,
  RESOURCE_TYPE_LABEL,
  RESOURCE_TYPE_ICON,
  RESOURCE_CONDITION_INTENT,
  RESOURCE_CONDITION_LABEL,
  ACTIVE_RESOURCE_STATUSES,
} from "./types";

// ─── API ─────────────────────────────────────────────────────────────────────
export {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  assignResource,
  unassignResource,
  reassignResource,
  getResourceHistory,
  listOfficeResources,
} from "./api/resourceApi";
