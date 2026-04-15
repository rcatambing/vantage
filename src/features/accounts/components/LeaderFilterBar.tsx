import { InputGroup, HTMLSelect } from "@blueprintjs/core";
import type { InfluenceLevel, SupportStatus } from "../types";

const INFLUENCE_OPTIONS = [
  { value: "", label: "All Influence" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "KEY_INFLUENCER", label: "Key Influencer" },
];

const SUPPORT_OPTIONS = [
  { value: "", label: "All Support Status" },
  { value: "UNKNOWN", label: "Unknown" },
  { value: "SUPPORTER", label: "Supporter" },
  { value: "NEUTRAL", label: "Neutral" },
  { value: "OPPONENT", label: "Opponent" },
  { value: "UNDECIDED", label: "Undecided" },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  districtIdFilter: string;
  onDistrictIdChange: (v: string) => void;
  ownerIdFilter: string;
  onOwnerIdChange: (v: string) => void;
  influenceFilter: InfluenceLevel | "";
  onInfluenceChange: (v: InfluenceLevel | "") => void;
  supportFilter: SupportStatus | "";
  onSupportChange: (v: SupportStatus | "") => void;
}

export function LeaderFilterBar({
  search,
  onSearchChange,
  districtIdFilter,
  onDistrictIdChange,
  ownerIdFilter,
  onOwnerIdChange,
  influenceFilter,
  onInfluenceChange,
  supportFilter,
  onSupportChange,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <InputGroup
        leftIcon="search"
        placeholder="Search leaders…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ width: 220 }}
      />
      <InputGroup
        placeholder="District ID"
        value={districtIdFilter}
        onChange={(e) => onDistrictIdChange(e.target.value)}
        style={{ width: 140 }}
      />
      <InputGroup
        placeholder="Owner ID"
        value={ownerIdFilter}
        onChange={(e) => onOwnerIdChange(e.target.value)}
        style={{ width: 140 }}
      />
      <HTMLSelect
        value={influenceFilter}
        onChange={(e) =>
          onInfluenceChange(e.target.value as InfluenceLevel | "")
        }
        options={INFLUENCE_OPTIONS}
      />
      <HTMLSelect
        value={supportFilter}
        onChange={(e) =>
          onSupportChange(e.target.value as SupportStatus | "")
        }
        options={SUPPORT_OPTIONS}
      />
    </div>
  );
}
