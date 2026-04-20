/**
 * Shared gender encoding constants for M04 visualizations.
 * Single source of truth for colors, labels, and formatting.
 */

export const GENDER_COLORS: Record<string, string> = {
  MALE: "#78a9ff",
  FEMALE: "#ff7eb6",
  LGBT: "#d4bbff",
  PREFER_NOT_TO_SAY: "#8d8d8d",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  LGBT: "LGBT+",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

export const fmt = new Intl.NumberFormat("en-PH");
