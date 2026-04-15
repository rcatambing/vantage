import { InputGroup, HTMLSelect, Button } from "@blueprintjs/core";
import { useAffiliations } from "../hooks/useAffiliations";
import { useAffiliationTypes } from "../hooks/useAffiliationTypes";
import { useSignalTypes } from "../hooks/useSignalTypes";
import type { AccountStatus, AccountSegment } from "../types";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PROSPECT", label: "Prospect" },
  { value: "CHURNED", label: "Churned" },
];

const SEGMENT_OPTIONS = [
  { value: "", label: "All Segments" },
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "MID_MARKET", label: "Mid-Market" },
  { value: "SMB", label: "SMB" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "NGO", label: "NGO" },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  districtIdFilter: string;
  onDistrictIdChange: (v: string) => void;
  ownerIdFilter: string;
  onOwnerIdChange: (v: string) => void;
  statusFilter: AccountStatus | "";
  onStatusChange: (v: AccountStatus | "") => void;
  segmentFilter: AccountSegment | "";
  onSegmentChange: (v: AccountSegment | "") => void;
  // Account intelligence filters (Epic 11)
  affiliationTypeIdFilter: string;
  onAffiliationTypeIdChange: (v: string) => void;
  affiliationIdFilter: string;
  onAffiliationIdChange: (v: string) => void;
  signalTypeIdFilter: string;
  onSignalTypeIdChange: (v: string) => void;
}

export function AccountFilterBar({
  search,
  onSearchChange,
  districtIdFilter,
  onDistrictIdChange,
  ownerIdFilter,
  onOwnerIdChange,
  statusFilter,
  onStatusChange,
  segmentFilter,
  onSegmentChange,
  affiliationTypeIdFilter,
  onAffiliationTypeIdChange,
  affiliationIdFilter,
  onAffiliationIdChange,
  signalTypeIdFilter,
  onSignalTypeIdChange,
}: Props) {
  const { items: affiliationTypes } = useAffiliationTypes();
  const { items: affiliations } = useAffiliations(affiliationTypeIdFilter || undefined);
  const { items: signalTypes } = useSignalTypes();

  const affiliationTypeOptions = [
    { value: "", label: "All Affiliation Types" },
    ...affiliationTypes.map((item) => ({ value: item.id, label: `${item.name} (${item.code})` })),
  ];

  const affiliationOptions = [
    { value: "", label: "All Affiliations" },
    ...affiliations.map((item) => ({ value: item.id, label: item.name })),
  ];

  const signalTypeOptions = [
    { value: "", label: "All Signal Types" },
    ...signalTypes.map((item) => ({ value: item.id, label: `${item.name} (${item.code})` })),
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <InputGroup
        leftIcon="search"
        placeholder="Search accounts…"
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
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as AccountStatus | "")}
        options={STATUS_OPTIONS}
      />
      <HTMLSelect
        value={segmentFilter}
        onChange={(e) => onSegmentChange(e.target.value as AccountSegment | "")}
        options={SEGMENT_OPTIONS}
      />
      <HTMLSelect
        value={affiliationTypeIdFilter}
        onChange={(e) => {
          const value = e.target.value;
          onAffiliationTypeIdChange(value);
          onAffiliationIdChange("");
        }}
        options={affiliationTypeOptions}
        title="Filter by affiliation type"
      />
      <HTMLSelect
        key={affiliationTypeIdFilter || "all-affiliations"}
        value={affiliationIdFilter}
        onChange={(e) => onAffiliationIdChange(e.target.value)}
        options={affiliationOptions}
        disabled={!affiliationTypeIdFilter}
        title="Filter by affiliation"
      />
      <HTMLSelect
        value={signalTypeIdFilter}
        onChange={(e) => onSignalTypeIdChange(e.target.value)}
        options={signalTypeOptions}
        title="Filter by signal type"
      />
      <Button
        minimal
        small
        onClick={() => {
          onAffiliationTypeIdChange("");
          onAffiliationIdChange("");
          onSignalTypeIdChange("");
        }}
      >
        Clear Taxonomy
      </Button>
    </div>
  );
}
