import { useState } from "react";
import {
  Button,
  ButtonGroup,
  Alert,
  Intent,
} from "@blueprintjs/core";
import { usePollLifecycle } from "../hooks/usePolls";
import type { PollStatus } from "../types";

interface Props {
  pollId: string;
  status: PollStatus;
  onMutate: () => void;
  compact?: boolean;
}

export default function PollLifecycleActions({
  pollId,
  status,
  onMutate,
  compact = false,
}: Props) {
  const lifecycle = usePollLifecycle({ onSuccess: onMutate });
  const [confirmAction, setConfirmAction] = useState<
    "start" | "hold" | "complete" | "cancel" | null
  >(null);

  const isStartDisabled = status !== "NOT_STARTED" && status !== "ON_HOLD";
  const isHoldDisabled = status !== "ONGOING";
  const isCompleteDisabled = status !== "ONGOING" && status !== "ON_HOLD";
  const isCancelDisabled = status === "CANCELLED" || status === "COMPLETED";

  const handleConfirm = async () => {
    if (!confirmAction) return;
    let success = false;
    switch (confirmAction) {
      case "start":
        success = await lifecycle.start(pollId);
        break;
      case "hold":
        success = await lifecycle.hold(pollId);
        break;
      case "complete":
        success = await lifecycle.complete(pollId);
        break;
      case "cancel":
        success = await lifecycle.cancel(pollId);
        break;
    }
    if (success) {
      setConfirmAction(null);
    }
  };

  const confirmConfig: Record<
    NonNullable<typeof confirmAction>,
    { title: string; intent: Intent; description: string }
  > = {
    start: {
      title: "Start Poll?",
      intent: Intent.PRIMARY,
      description: "This will make the poll active and begin collecting responses.",
    },
    hold: {
      title: "Hold Poll?",
      intent: Intent.WARNING,
      description: "This will pause the poll. You can resume it later.",
    },
    complete: {
      title: "Complete Poll?",
      intent: Intent.SUCCESS,
      description: "This will finalize the poll and stop collecting responses.",
    },
    cancel: {
      title: "Cancel Poll?",
      intent: Intent.DANGER,
      description: "This will permanently cancel the poll. This action cannot be undone.",
    },
  };

  return (
    <>
      <ButtonGroup minimal={compact} vertical={false}>
        <Button
          small={compact}
          intent={Intent.PRIMARY}
          icon="play"
          text={compact ? undefined : "Start"}
          disabled={isStartDisabled}
          onClick={() => setConfirmAction("start")}
          aria-label="Start poll"
        />
        <Button
          small={compact}
          intent={Intent.WARNING}
          icon="pause"
          text={compact ? undefined : "Hold"}
          disabled={isHoldDisabled}
          onClick={() => setConfirmAction("hold")}
          aria-label="Hold poll"
        />
        <Button
          small={compact}
          intent={Intent.SUCCESS}
          icon="tick"
          text={compact ? undefined : "Complete"}
          disabled={isCompleteDisabled}
          onClick={() => setConfirmAction("complete")}
          aria-label="Complete poll"
        />
        <Button
          small={compact}
          intent={Intent.DANGER}
          icon="cross"
          text={compact ? undefined : "Cancel"}
          disabled={isCancelDisabled}
          onClick={() => setConfirmAction("cancel")}
          aria-label="Cancel poll"
        />
      </ButtonGroup>

      <Alert
        isOpen={confirmAction !== null}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        confirmButtonText="Confirm"
        cancelButtonText="Back"
        intent={confirmAction ? confirmConfig[confirmAction].intent : Intent.NONE}
        loading={lifecycle.transitioning}
      >
        {confirmAction && (
          <>
            <p style={{ fontWeight: 600 }}>{confirmConfig[confirmAction].title}</p>
            <p>{confirmConfig[confirmAction].description}</p>
          </>
        )}
      </Alert>
    </>
  );
}
