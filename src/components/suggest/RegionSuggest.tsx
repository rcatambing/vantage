import type { Intent } from "@blueprintjs/core";
import EntitySuggest from "./EntitySuggest";
import { useRegionSuggestData } from "../../hooks/useRegionSuggestData";
import type { RegionOption } from "../../hooks/useRegionSuggestData";

interface Props {
  selectedId: string;
  onSelect: (id: string, name: string) => void;
  disabled?: boolean;
  intent?: Intent;
}

export default function RegionSuggest({ selectedId, onSelect, disabled, intent }: Props) {
  const { items, loading } = useRegionSuggestData();
  const selected = items.find((r) => r.id === selectedId) ?? null;

  return (
    <EntitySuggest<RegionOption>
      items={items}
      selectedItem={selected}
      onItemSelect={(item) => onSelect(item.id, item.name)}
      onClear={() => onSelect("", "")}
      itemKeyRenderer={(item) => item.id}
      inputValueRenderer={(item) => item.name}
      itemTextRenderer={(item) => item.name}
      itemLabelRenderer={(item) => item.code}
      itemPredicate={(query, item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase())
      }
      itemsEqual={(a, b) => a.id === b.id}
      placeholder="Search regions…"
      disabled={disabled}
      intent={intent}
      loading={loading}
    />
  );
}
