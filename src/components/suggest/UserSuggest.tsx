import type { Intent } from "@blueprintjs/core";
import EntitySuggest from "./EntitySuggest";
import { useUserSuggestData } from "../../hooks/useUserSuggestData";
import type { StaffOption } from "../../hooks/useUserSuggestData";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  intent?: Intent;
}

export default function UserSuggest({ selectedId, onSelect, disabled, intent }: Props) {
  const { items, loading } = useUserSuggestData();
  const selected = items.find((u) => u.id === selectedId) ?? null;

  return (
    <EntitySuggest<StaffOption>
      items={items}
      selectedItem={selected}
      onItemSelect={(item) => onSelect(item.id)}
      onClear={() => onSelect("")}
      itemKeyRenderer={(item) => item.id}
      inputValueRenderer={(item) => item.full_name}
      itemTextRenderer={(item) => item.full_name}
      itemLabelRenderer={(item) => item.role}
      itemPredicate={(query, item) =>
        item.full_name.toLowerCase().includes(query.toLowerCase()) ||
        item.role.toLowerCase().includes(query.toLowerCase())
      }
      itemsEqual={(a, b) => a.id === b.id}
      placeholder="Search staff…"
      disabled={disabled}
      intent={intent}
      loading={loading}
    />
  );
}
