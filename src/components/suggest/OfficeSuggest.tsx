import type { Intent } from "@blueprintjs/core";
import EntitySuggest from "./EntitySuggest";
import { useOfficeSuggestData } from "../../hooks/useOfficeSuggestData";
import type { OfficeOption } from "../../hooks/useOfficeSuggestData";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  intent?: Intent;
  /** Office IDs to exclude from the dropdown (e.g. current office in reassign). */
  excludeIds?: string[];
}

export default function OfficeSuggest({ selectedId, onSelect, disabled, intent, excludeIds }: Props) {
  const { items, loading } = useOfficeSuggestData();
  const filtered = excludeIds?.length
    ? items.filter((o) => !excludeIds.includes(o.id))
    : items;
  const selected = filtered.find((o) => o.id === selectedId) ?? null;

  return (
    <EntitySuggest<OfficeOption>
      items={filtered}
      selectedItem={selected}
      onItemSelect={(item) => onSelect(item.id)}
      onClear={() => onSelect("")}
      itemKeyRenderer={(item) => item.id}
      inputValueRenderer={(item) =>
        item.office_code
          ? `${item.office_name} (${item.office_code})`
          : item.office_name
      }
      itemTextRenderer={(item) => item.office_name}
      itemLabelRenderer={(item) =>
        [item.office_code, item.city_municipality].filter(Boolean).join(" · ") || undefined
      }
      itemPredicate={(query, item) => {
        const q = query.toLowerCase();
        return (
          item.office_name.toLowerCase().includes(q) ||
          (item.office_code?.toLowerCase().includes(q) ?? false) ||
          (item.city_municipality?.toLowerCase().includes(q) ?? false)
        );
      }}
      itemsEqual={(a, b) => a.id === b.id}
      placeholder="Search offices…"
      disabled={disabled}
      intent={intent}
      loading={loading}
    />
  );
}
