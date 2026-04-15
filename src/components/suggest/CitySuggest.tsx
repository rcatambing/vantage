import type { Intent } from "@blueprintjs/core";
import EntitySuggest from "./EntitySuggest";
import { useCitySuggestData } from "../../hooks/useCitySuggestData";
import type { CityOption } from "../../hooks/useCitySuggestData";

interface Props {
  regionId: string | null;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
  disabled?: boolean;
  intent?: Intent;
}

export default function CitySuggest({ regionId, selectedId, onSelect, disabled, intent }: Props) {
  const { items, loading } = useCitySuggestData(regionId);
  const selected = items.find((c) => c.id === selectedId) ?? null;

  return (
    <EntitySuggest<CityOption>
      items={items}
      selectedItem={selected}
      onItemSelect={(item) => onSelect(item.id, item.name)}
      onClear={() => onSelect("", "")}
      itemKeyRenderer={(item) => item.id}
      inputValueRenderer={(item) => item.name}
      itemTextRenderer={(item) => item.name}
      itemPredicate={(query, item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      }
      itemsEqual={(a, b) => a.id === b.id}
      placeholder={regionId ? "Search cities…" : "Select a region first"}
      disabled={disabled || !regionId}
      intent={intent}
      loading={loading}
    />
  );
}
