import { useState, useCallback } from "react";
import {
  Button,
  HTMLSelect,
  InputGroup,
  ControlGroup,
  Intent,
} from "@blueprintjs/core";
import type { AnecdoteFilters, IntelClassification } from "../types";
import { CLASSIFICATION_OPTIONS } from "../types";

interface Props {
  filters: AnecdoteFilters;
  onChange: (filters: Partial<AnecdoteFilters>) => void;
}

export default function IntelFilterBar({ filters, onChange }: Props) {
  const [localSearch, setLocalSearch] = useState(filters.search ?? "");

  const hasFilters = !!(
    filters.classification ||
    filters.date_from ||
    filters.date_to ||
    filters.author_id ||
    filters.district_id ||
    filters.search
  );

  const handleClear = useCallback(() => {
    setLocalSearch("");
    onChange({
      classification: undefined,
      date_from: undefined,
      date_to: undefined,
      author_id: undefined,
      district_id: undefined,
      search: undefined,
      page: 1,
    });
  }, [onChange]);

  const handleSearchSubmit = useCallback(() => {
    onChange({ search: localSearch.trim() || undefined, page: 1 });
  }, [localSearch, onChange]);

  return (
    <ControlGroup fill={false} style={{ gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
        <InputGroup
          placeholder="Search anecdotes…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit();
          }}
          rightElement={
            <Button
              minimal
              small
              icon="search"
              onClick={handleSearchSubmit}
              aria-label="Search"
            />
          }
          style={{ minWidth: 220, borderRadius: 0 }}
        />

        <HTMLSelect
          value={Array.isArray(filters.classification) ? "" : (filters.classification ?? "")}
          onChange={(e) => {
            const val = e.target.value as IntelClassification | "";
            onChange({
              classification: val ? val : undefined,
              page: 1,
            });
          }}
          options={[
            { value: "", label: "All Classifications" },
            ...CLASSIFICATION_OPTIONS,
          ]}
          style={{ minWidth: 160, borderRadius: 0 }}
        />

        <InputGroup
          type="date"
          placeholder="From date"
          value={filters.date_from ?? ""}
          onChange={(e) => onChange({ date_from: e.target.value || undefined, page: 1 })}
          style={{ minWidth: 140, borderRadius: 0 }}
          aria-label="From date"
        />

        <InputGroup
          type="date"
          placeholder="To date"
          value={filters.date_to ?? ""}
          onChange={(e) => onChange({ date_to: e.target.value || undefined, page: 1 })}
          style={{ minWidth: 140, borderRadius: 0 }}
          aria-label="To date"
        />

        <InputGroup
          placeholder="Author ID"
          value={filters.author_id ?? ""}
          onChange={(e) => onChange({ author_id: e.target.value || undefined, page: 1 })}
          style={{ minWidth: 140, borderRadius: 0 }}
          aria-label="Author ID"
        />

        <InputGroup
          placeholder="District ID"
          value={filters.district_id ?? ""}
          onChange={(e) => onChange({ district_id: e.target.value || undefined, page: 1 })}
          style={{ minWidth: 140, borderRadius: 0 }}
          aria-label="District ID"
        />
      </div>

      {hasFilters && (
        <Button
          minimal
          small
          intent={Intent.WARNING}
          icon="filter-remove"
          text="Clear filters"
          onClick={handleClear}
          style={{ flexShrink: 0 }}
        />
      )}
    </ControlGroup>
  );
}
