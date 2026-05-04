import type { CampaignStatus } from "../types";
import { CAMPAIGN_STATUS_LABEL } from "../types";

const STATUS_STYLES: Record<CampaignStatus, { bg: string; color: string }> = {
  PLANNED:   { bg: "var(--cds-tag-gray-bg)",   color: "var(--cds-tag-gray-text)" },
  ACTIVE:    { bg: "var(--cds-tag-blue-bg)",   color: "var(--cds-tag-blue-text)" },
  COMPLETED: { bg: "var(--cds-tag-green-bg)",  color: "var(--cds-tag-green-text)" },
  ON_HOLD:   { bg: "var(--cds-tag-yellow-bg)", color: "var(--cds-tag-yellow-text)" },
  CANCELLED: { bg: "var(--cds-tag-red-bg)",    color: "var(--cds-tag-red-text)" },
};

interface Props {
  status: CampaignStatus;
}

export default function CampaignStatusBadge({ status }: Props) {
  const style = STATUS_STYLES[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: 24,
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1,
        background: style.bg,
        color: style.color,
      }}
    >
      {CAMPAIGN_STATUS_LABEL[status]}
    </span>
  );
}
