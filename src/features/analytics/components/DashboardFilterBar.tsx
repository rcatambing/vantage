import { useState, useCallback } from "react";
import {
  Button,
  InputGroup,
  HTMLSelect,
  FormGroup,
  Classes,
} from "@blueprintjs/core";

export interface DashboardFilters {
  campaignId: string;
  dateFrom: string;
  dateTo: string;
  districtId: string;
}

interface Props {
  campaigns: { id: string; name: string }[];
  districts: { id: string; name: string }[];
  initialFilters?: Partial<DashboardFilters>;
  onApply: (filters: DashboardFilters) => void;
  onClear: () => void;
}

/**
 * Sticky filter bar for campaign dashboards.
 * Provides campaign selector, date range picker, and district filter.
 */
export default function DashboardFilterBar({
  campaigns,
  districts,
  initialFilters,
  onApply,
  onClear,
}: Props) {
  const [campaignId, setCampaignId] = useState(initialFilters?.campaignId ?? "1");
  const [dateFrom, setDateFrom] = useState(initialFilters?.dateFrom ?? "");
  const [dateTo, setDateTo] = useState(initialFilters?.dateTo ?? "");
  const [districtId, setDistrictId] = useState(initialFilters?.districtId ?? "");

  const handleApply = useCallback(() => {
    onApply({ campaignId, dateFrom, dateTo, districtId });
  }, [campaignId, dateFrom, dateTo, districtId, onApply]);

  const handleClear = useCallback(() => {
    setCampaignId("1");
    setDateFrom("");
    setDateTo("");
    setDistrictId("");
    onClear();
  }, [onClear]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "var(--cds-layer-01)",
        borderBottom: "1px solid var(--cds-border-subtle)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <FormGroup label="Campaign" style={{ margin: 0, minWidth: 180 }}>
        <HTMLSelect
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          fill
          aria-label="Select campaign"
        >
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>

      <FormGroup label="From" style={{ margin: 0, minWidth: 140 }}>
        <InputGroup
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label="Start date"
        />
      </FormGroup>

      <FormGroup label="To" style={{ margin: 0, minWidth: 140 }}>
        <InputGroup
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label="End date"
        />
      </FormGroup>

      <FormGroup label="District" style={{ margin: 0, minWidth: 180 }}>
        <HTMLSelect
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          fill
          aria-label="Select district"
        >
          <option value="">All districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>

      <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        <Button
          onClick={handleClear}
          minimal
          className={Classes.TEXT_MUTED}
          aria-label="Clear filters"
        >
          Clear
        </Button>
        <Button
          onClick={handleApply}
          intent="primary"
          icon="filter"
          aria-label="Apply filters"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
