import { Intent, Tag } from "@blueprintjs/core";
import type { SupportStatus } from "../types";

const INTENT: Record<SupportStatus, Intent> = {
  UNKNOWN: Intent.NONE,
  SUPPORTER: Intent.SUCCESS,
  NEUTRAL: Intent.NONE,
  OPPONENT: Intent.DANGER,
  UNDECIDED: Intent.WARNING,
};

const LABEL: Record<SupportStatus, string> = {
  UNKNOWN: "Unknown",
  SUPPORTER: "Supporter",
  NEUTRAL: "Neutral",
  OPPONENT: "Opponent",
  UNDECIDED: "Undecided",
};

interface Props {
  status: SupportStatus;
  minimal?: boolean;
}

export function SupportStatusTag({ status, minimal = true }: Props) {
  return (
    <Tag intent={INTENT[status]} minimal={minimal} style={{ borderRadius: 0 }}>
      {LABEL[status]}
    </Tag>
  );
}
