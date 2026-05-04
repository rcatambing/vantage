import { useState, useEffect, useCallback } from "react";
import { InputGroup, Spinner, Menu, MenuItem } from "@blueprintjs/core";
import { useDistrictSearch } from "../hooks/useDistricts";

interface Props {
  onSelect: (districtId: string, districtName: string) => void;
  placeholder?: string;
}

/**
 * Debounced district search bar with async dropdown results.
 * GET /api/districts/search
 * aria-live="polite" for result count announcements.
 */
export default function DistrictSearchBar({ onSelect, placeholder = "Search districts..." }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { results, loading, search } = useDistrictSearch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [debouncedQuery, search]);

  const handleSelect = useCallback(
    (id: string, name: string) => {
      setQuery(name);
      setOpen(false);
      onSelect(id, name);
    },
    [onSelect],
  );

  return (
    <div style={{ position: "relative", maxWidth: 400 }}>
      <InputGroup
        leftIcon="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value.trim()) setOpen(false);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        aria-label="Search districts"
        rightElement={loading ? <Spinner size={14} /> : undefined}
      />

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle)",
            marginTop: 4,
            maxHeight: 240,
            overflow: "auto",
          }}
        >
          <div aria-live="polite" className="bp5-sr-only">
            {results.length} result{results.length === 1 ? "" : "s"} found
          </div>
          {results.length === 0 && !loading && (
            <div style={{ padding: 12, fontSize: 13, color: "var(--cds-text-secondary)" }}>
              No districts found
            </div>
          )}
          {results.map((d) => (
            <Menu key={d.id}>
              <MenuItem
                text={d.name}
                label={d.district_type}
                onClick={() => handleSelect(d.id, d.name)}
              />
            </Menu>
          ))}
        </div>
      )}
    </div>
  );
}
