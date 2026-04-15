import type { CampaignStatus, TicketStatus, UserRole } from "../types";

export interface LocationEditability {
  editable: boolean;
  disabledMessage: string | null;
  warningMessage: string | null;
}

// ---------------------------------------------------------------------------
// BR-212 / BR-213: Location field editability check.
// ---------------------------------------------------------------------------

const ELEVATED_ROLES: ReadonlySet<UserRole> = new Set([
  "SUPERVISOR",
  "MANAGER",
]);

export function getLocationEditability(
  campaignStatus: CampaignStatus,
  ticketStatus: TicketStatus,
  userRole: UserRole,
): LocationEditability {
  // BR-212: terminal campaign = fully read-only for all roles.
  if (campaignStatus === "COMPLETED" || campaignStatus === "CANCELLED") {
    return {
      editable: false,
      disabledMessage: `Campaign is ${campaignStatus.toLowerCase()} — ticket location is read-only.`,
      warningMessage: null,
    };
  }

  // BR-213: terminal ticket status = location locked.
  if (ticketStatus === "COMPLETED" || ticketStatus === "CANCELLED") {
    return {
      editable: false,
      disabledMessage: `Ticket is ${ticketStatus.toLowerCase()} — location cannot be changed.`,
      warningMessage: null,
    };
  }

  // BR-212: ON_HOLD campaign restricts to elevated roles only.
  if (campaignStatus === "ON_HOLD") {
    if (!ELEVATED_ROLES.has(userRole)) {
      return {
        editable: false,
        disabledMessage:
          "Campaign is on hold — only Supervisors and Managers may edit location.",
        warningMessage: null,
      };
    }
    return {
      editable: true,
      disabledMessage: null,
      warningMessage:
        "Campaign is on hold. Location edits are restricted to elevated roles.",
    };
  }

  return { editable: true, disabledMessage: null, warningMessage: null };
}

// ---------------------------------------------------------------------------
// BR-213: Does updating the location require a change_reason field?
// ---------------------------------------------------------------------------

const POST_OPEN_STATUSES: ReadonlySet<TicketStatus> = new Set([
  "OPEN",
  "IN_PROGRESS",
  "ON_HOLD",
]);

export function requiresChangeReason(ticketStatus: TicketStatus): boolean {
  return POST_OPEN_STATUSES.has(ticketStatus);
}

// ---------------------------------------------------------------------------
// Change-reason field validation helper.
// ---------------------------------------------------------------------------

export function validateChangeReason(
  changeReason: string | undefined | null,
  ticketStatus: TicketStatus,
): string | null {
  if (!requiresChangeReason(ticketStatus)) return null;
  if (!changeReason || changeReason.trim().length < 10) {
    return "Change reason is required (minimum 10 characters) when updating location after a ticket is open.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// BR-212: Ticket creation gate based on campaign status.
// ---------------------------------------------------------------------------

export interface CreateGate {
  allowed: boolean;
  isHardBlock: boolean;
  message: string | null;
}

export function getTicketCreateGate(
  campaignStatus: CampaignStatus,
): CreateGate {
  if (campaignStatus === "CANCELLED") {
    return {
      allowed: false,
      isHardBlock: true,
      message: "Campaign is cancelled — tickets cannot be created.",
    };
  }
  if (campaignStatus === "COMPLETED") {
    return {
      allowed: false,
      isHardBlock: true,
      message: "Campaign is completed — tickets cannot be created.",
    };
  }
  if (campaignStatus === "ON_HOLD") {
    return {
      allowed: true,
      isHardBlock: false,
      message: "Campaign is on hold. New tickets can still be created.",
    };
  }
  return { allowed: true, isHardBlock: false, message: null };
}
