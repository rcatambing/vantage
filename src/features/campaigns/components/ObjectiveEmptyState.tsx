import { NonIdealState, Button, Intent } from "@blueprintjs/core";

interface Props {
  onAddClick?: () => void;
  isTerminal?: boolean;
}

export default function ObjectiveEmptyState({ onAddClick, isTerminal }: Props) {
  return (
    <div aria-live="polite">
      <NonIdealState
        icon="target"
        title="No objectives yet"
        description="Objectives define what this campaign aims to achieve. Add your first objective to begin tracking progress."
        action={
          !isTerminal ? (
            <Button
              icon="plus"
              intent={Intent.PRIMARY}
              text="Add objective"
              onClick={onAddClick}
              style={{ borderRadius: 0, minHeight: 48 }}
            />
          ) : undefined
        }
      />
    </div>
  );
}
