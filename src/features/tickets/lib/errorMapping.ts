import type { ApiErrorDetail, ApiValidationError } from "../types";

// ---------------------------------------------------------------------------
// Known backend error codes → UI messages
// ---------------------------------------------------------------------------

const ERROR_CODE_MESSAGES: Record<string, string> = {
  TICKET_NOT_FOUND: "Ticket not found or you do not have access.",
  CAMPAIGN_NOT_FOUND: "The associated campaign could not be found.",
  CAMPAIGN_TYPE_NOT_ALLOWED:
    "Your campaign type does not allow this operation.",
  campaign_terminal_read_only:
    "This campaign or ticket is closed — location cannot be modified.",
  TICKET_LOCATION_EDIT_FORBIDDEN_ROLE:
    "Your role does not allow location edits while the campaign is on hold.",
  TICKET_LOCATION_REASON_REQUIRED:
    "A change reason (min 10 characters) is required when updating location after a ticket is open.",
  TICKET_LOCATION_VALIDATION_FAILED:
    "Service location contains invalid or missing fields.",
  TICKET_TYPE_IMMUTABLE: "Ticket type cannot be changed after creation.",
  TICKET_STATUS_INVALID_TRANSITION: "This status transition is not allowed.",
  TICKET_DELETE_FORBIDDEN_NON_DRAFT: "Only DRAFT tickets can be deleted.",
  TICKET_LOCATION_CONFLICT:
    "A concurrent location update was detected. Refresh and retry.",
  TICKET_RADIUS_FILTER_INVALID:
    "Radius filtering requires center_lat, center_lng, and radius_km together.",
  RELATIONSHIP_CONFLICT:
    "A relationship of this kind already exists between these tickets.",
  RELATIONSHIP_SELF_REFERENCE: "A ticket cannot be related to itself.",
};

// ---------------------------------------------------------------------------
// mapApiError
// ---------------------------------------------------------------------------

export function mapApiError(err: unknown): string {
  if (!err || typeof err !== "object") {
    return "An unexpected error occurred.";
  }

  const e = err as Record<string, unknown>;

  // Structured RFC-7807 shape: { code, message, detail? }
  if (typeof e["code"] === "string") {
    const detail = e as unknown as ApiErrorDetail;
    return (
      ERROR_CODE_MESSAGES[detail.code] ??
      detail.message ??
      `Error: ${detail.code}`
    );
  }

  // FastAPI 422 validation error array at top level: { detail: [...] }
  if (Array.isArray(e["detail"])) {
    const items = e["detail"] as ApiValidationError[];
    const first = items[0];
    if (first) {
      const field = first.loc.filter((s) => s !== "body").join(".");
      return field ? `${field}: ${first.msg}` : first.msg;
    }
  }

  if (err instanceof Error) return err.message;

  return "An unexpected error occurred.";
}

// ---------------------------------------------------------------------------
// extractFieldErrors
// ---------------------------------------------------------------------------

export function extractFieldErrors(err: unknown): Record<string, string> {
  if (!err || typeof err !== "object") return {};
  const e = err as Record<string, unknown>;
  if (!Array.isArray(e["detail"])) return {};

  const result: Record<string, string> = {};
  for (const item of e["detail"] as ApiValidationError[]) {
    const fieldPath = item.loc
      .filter((segment) => segment !== "body")
      .join(".");
    if (fieldPath) result[fieldPath] = item.msg;
  }
  return result;
}
