import type { TicketServiceLocation, TicketType } from "../types";

// Field → error message dictionary. Empty object = valid.
export type FieldErrors = Record<string, string>;

// ---------------------------------------------------------------------------
// BR-210 (amended 2026-04-08): Location is optional for ALL ticket types.
// Retained for API compatibility; always returns false.
// ---------------------------------------------------------------------------

export function requiresLocation(_ticketType: TicketType): boolean {
  return false;
}

// ---------------------------------------------------------------------------
// BR-210: Returns true if any field in the location payload is non-empty.
// ---------------------------------------------------------------------------

export function hasAnyLocationField(
  loc: Partial<TicketServiceLocation> | null | undefined,
): boolean {
  if (!loc) return false;
  return Object.entries(loc).some(([, v]) => v != null && v !== "");
}

// ---------------------------------------------------------------------------
// BR-210 + BR-211: Full field-level validation.
// ---------------------------------------------------------------------------

export function validateServiceLocation(
  loc: Partial<TicketServiceLocation> | null | undefined,
  _ticketType: TicketType,
): FieldErrors {
  const errors: FieldErrors = {};

  const anyFilled = hasAnyLocationField(loc);

  // No location fields provided: skip all validation for any ticket type.
  if (!anyFilled) return errors;

  const l = loc!;

  // BR-210 (amended): if any location field is provided, require admin fields.
  for (const field of [
    "country_code",
    "region",
    "city_municipality",
  ] as const) {
    if (!l[field]) {
      errors[field] = "Required when any location field is provided.";
    }
  }
  const hasAddress = Boolean(l.full_address?.trim());
  const hasCoords = l.latitude != null && l.longitude != null;
  if (!hasAddress && !hasCoords) {
    errors["full_address"] =
      "Provide a full address or coordinate pair (latitude + longitude).";
  }

  // BR-211: coordinates must be paired.
  const latSet = l.latitude != null;
  const lngSet = l.longitude != null;
  if (latSet !== lngSet) {
    const missing = latSet ? "longitude" : "latitude";
    errors[missing] =
      "Latitude and longitude must both be provided together.";
  }

  // BR-211: coordinate range and precision.
  if (l.latitude != null) {
    if (l.latitude < -90 || l.latitude > 90) {
      errors["latitude"] = "Latitude must be between -90 and 90.";
    } else if (exceedsDecimalPrecision(l.latitude, 6)) {
      errors["latitude"] = "Latitude may have at most 6 decimal places.";
    }
  }
  if (l.longitude != null) {
    if (l.longitude < -180 || l.longitude > 180) {
      errors["longitude"] = "Longitude must be between -180 and 180.";
    } else if (exceedsDecimalPrecision(l.longitude, 6)) {
      errors["longitude"] = "Longitude may have at most 6 decimal places.";
    }
  }

  // BR-211: geo_precision required when coordinates are present.
  if (latSet && lngSet && !l.geo_precision) {
    errors["geo_precision"] =
      "Geo precision is required when coordinates are provided.";
  }

  // BR-211: verified_at / verified_by must both be present or both absent.
  const hasVerifiedAt = Boolean(l.verified_at);
  const hasVerifiedBy = Boolean(l.verified_by);
  if (hasVerifiedAt !== hasVerifiedBy) {
    const missing = hasVerifiedAt ? "verified_by" : "verified_at";
    errors[missing] =
      "verified_at and verified_by must be provided together.";
  }

  // BR-211: verified_at cannot be in the future.
  if (l.verified_at) {
    const verifiedDate = new Date(l.verified_at);
    if (!isNaN(verifiedDate.getTime()) && verifiedDate > new Date()) {
      errors["verified_at"] = "Verified date cannot be in the future.";
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Utility: check if a number has more than maxPlaces decimal digits.
// ---------------------------------------------------------------------------

function exceedsDecimalPrecision(value: number, maxPlaces: number): boolean {
  const str = value.toString();
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) return false;
  return str.length - dotIndex - 1 > maxPlaces;
}
