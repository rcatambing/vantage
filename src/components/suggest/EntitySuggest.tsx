import { MenuItem, Button, Spinner, type Intent } from "@blueprintjs/core";
import { Suggest } from "@blueprintjs/select";
import type { ItemRendererProps } from "@blueprintjs/select";

// ---------------------------------------------------------------------------
// Generic autocomplete wrapper around BlueprintJS Suggest.
// Thin enough that each domain wrapper only provides items + a few callbacks.
// ---------------------------------------------------------------------------

export interface EntitySuggestProps<T> {
  /** All items to display / filter. */
  items: T[];
  /** Currently selected item, or null. */
  selectedItem: T | null;
  /** Called when the user selects an item from the list. */
  onItemSelect: (item: T) => void;
  /** Called when the selection is cleared. */
  onClear?: () => void;
  /** Stable key extractor for React list rendering. */
  itemKeyRenderer: (item: T) => string;
  /** Render an item's display text (for the input field after selection). */
  inputValueRenderer: (item: T) => string;
  /** Render the label shown in each dropdown row. */
  itemTextRenderer: (item: T) => string;
  /** Optional secondary text for each dropdown row. */
  itemLabelRenderer?: (item: T) => string | undefined;
  /** Predicate to filter items by query string. */
  itemPredicate: (query: string, item: T) => boolean;
  /** Equality comparator (defaults to === if omitted). */
  itemsEqual?: (a: T, b: T) => boolean;
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Whether the field fills available width. */
  fill?: boolean;
  /** Input intent (for validation styling). */
  intent?: Intent;
  /** Whether items are still loading from the server. */
  loading?: boolean;
}

export default function EntitySuggest<T>({
  items,
  selectedItem,
  onItemSelect,
  onClear,
  itemKeyRenderer,
  inputValueRenderer,
  itemTextRenderer,
  itemLabelRenderer,
  itemPredicate,
  itemsEqual,
  placeholder,
  disabled,
  fill = true,
  intent,
  loading,
}: EntitySuggestProps<T>) {
  const renderItem = (
    item: T,
    { handleClick, handleFocus, modifiers }: ItemRendererProps,
  ) => {
    if (!modifiers.matchesPredicate) return null;
    return (
      <MenuItem
        key={itemKeyRenderer(item)}
        text={itemTextRenderer(item)}
        label={itemLabelRenderer?.(item)}
        active={modifiers.active}
        disabled={modifiers.disabled}
        onClick={handleClick}
        onFocus={handleFocus}
        roleStructure="listoption"
      />
    );
  };

  const noResultsContent = loading
    ? <MenuItem disabled text={<Spinner size={16} />} roleStructure="listoption" />
    : <MenuItem disabled text="No matches." roleStructure="listoption" />;

  return (
    <Suggest<T>
      items={items}
      selectedItem={selectedItem}
      onItemSelect={onItemSelect}
      inputValueRenderer={inputValueRenderer}
      itemRenderer={renderItem}
      itemPredicate={(query, item) =>
        !query ? true : itemPredicate(query, item)
      }
      itemsEqual={itemsEqual}
      fill={fill}
      disabled={disabled}
      resetOnClose
      popoverProps={{ minimal: true, matchTargetWidth: true }}
      inputProps={{
        placeholder,
        intent,
        rightElement: selectedItem && onClear ? (
          <Button
            minimal
            small
            icon="cross"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            aria-label="Clear selection"
          />
        ) : undefined,
      }}
      noResults={noResultsContent}
    />
  );
}
