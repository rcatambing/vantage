import { Intent, Tag } from "@blueprintjs/core";
import type { InfluenceLevel } from "../types";

const INTENT: Record<InfluenceLevel, Intent> = {
  LOW: Intent.NONE,
  MEDIUM: Intent.PRIMARY,
  HIGH: Intent.WARNING,
  /** Highest visibility — red intentional */
  KEY_INFLUENCER: Intent.DANGER,
};

const LABEL: Record<InfluenceLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  KEY_INFLUENCER: "Key Influencer",
};

interface Props {
  level: InfluenceLevel;
  minimal?: boolean;
}

export function InfluenceTag({ level, minimal = true }: Props) {
  return (
    <Tag intent={INTENT[level]} minimal={minimal} style={{ borderRadius: 0 }}>
      {LABEL[level]}
    </Tag>
  );
}
