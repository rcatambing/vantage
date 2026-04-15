import type { Intent } from "@blueprintjs/core";
import EntitySuggest from "./EntitySuggest";
import { useCampaignSuggestData } from "../../hooks/useCampaignSuggestData";
import type { CampaignOption } from "../../hooks/useCampaignSuggestData";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  intent?: Intent;
}

export default function CampaignSuggest({ selectedId, onSelect, disabled, intent }: Props) {
  const { items, loading } = useCampaignSuggestData();
  const selected = items.find((c) => c.id === selectedId) ?? null;

  return (
    <EntitySuggest<CampaignOption>
      items={items}
      selectedItem={selected}
      onItemSelect={(item) => onSelect(item.id)}
      onClear={() => onSelect("")}
      itemKeyRenderer={(item) => item.id}
      inputValueRenderer={(item) => item.name}
      itemTextRenderer={(item) => item.name}
      itemLabelRenderer={(item) => item.campaign_type}
      itemPredicate={(query, item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      }
      itemsEqual={(a, b) => a.id === b.id}
      placeholder="Search campaigns…"
      disabled={disabled}
      intent={intent}
      loading={loading}
    />
  );
}
