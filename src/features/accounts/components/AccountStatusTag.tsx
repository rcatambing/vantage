import { Intent, Tag } from "@blueprintjs/core";
import type { AccountStatus } from "../types";

const INTENT: Record<AccountStatus, Intent> = {
  ACTIVE: Intent.SUCCESS,
  INACTIVE: Intent.NONE,
  PROSPECT: Intent.PRIMARY,
  CHURNED: Intent.DANGER,
};

const LABEL: Record<AccountStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PROSPECT: "Prospect",
  CHURNED: "Churned",
};

interface Props {
  status: AccountStatus;
  minimal?: boolean;
}

export function AccountStatusTag({ status, minimal = true }: Props) {
  return (
    <Tag intent={INTENT[status]} minimal={minimal} style={{ borderRadius: 0 }}>
      {LABEL[status]}
    </Tag>
  );
}
