import React, { useState } from "react";
import { Button, Classes, Dialog, DialogBody, type IconName } from "@blueprintjs/core";
import { type FeedAction, type FeedActionType } from "../../types";
import { type InvestigateFormState, type TaskPersonnelFormState, type WatchFormState } from "./ActionTypes";
import { useApp } from "../../context/useApp";
import InvestigatePanel from "./InvestigatePanel";
import TaskPersonnelPanel from "./TaskPersonnelPanel";
import WatchPanel from "./WatchPanel";

interface ActionDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly actions: readonly FeedAction[];
  readonly onInvestigateSubmit: (state: InvestigateFormState) => void;
  readonly onTaskPersonnelSubmit: (state: TaskPersonnelFormState) => void;
  readonly onWatchSubmit: (state: WatchFormState) => void;
}

const ACTION_ICONS: Record<FeedActionType, IconName> = {
  investigate: "search",
  "task-personnel": "person",
  watch: "eye-open",
};

const ACTION_TITLES: Record<FeedActionType, string> = {
  investigate: "Create Investigation Task",
  "task-personnel": "Assign Personnel Task",
  watch: "Watch Post",
};

const ActionDialog: React.FC<ActionDialogProps> = ({
  isOpen,
  onClose,
  actions,
  onInvestigateSubmit,
  onTaskPersonnelSubmit,
  onWatchSubmit,
}) => {
  const [selectedAction, setSelectedAction] = useState<FeedAction | null>(null);
  const { darkMode } = useApp();

  const handleClose = () => {
    setSelectedAction(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedAction(null);
  };

  const handlePanelClose = () => {
    setSelectedAction(null);
    onClose();
  };

  const title = selectedAction ? ACTION_TITLES[selectedAction.type] : "Select Action";
  const icon: IconName = selectedAction ? ACTION_ICONS[selectedAction.type] : "lightning";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      icon={icon}
      className={darkMode ? Classes.DARK : undefined}
    >
      <DialogBody>
        {!selectedAction && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actions.map((action) => (
              <Button
                key={action.id}
                icon={ACTION_ICONS[action.type]}
                text={action.label}
                alignText="left"
                large
                outlined
                onClick={() => setSelectedAction(action)}
                style={{ justifyContent: "flex-start" }}
              />
            ))}
          </div>
        )}
        {selectedAction?.type === "investigate" && (
          <>
            <Button icon="arrow-left" text="Back" minimal small onClick={handleBack} style={{ marginBottom: 12 }} />
            <InvestigatePanel onClose={handlePanelClose} onSubmit={onInvestigateSubmit} />
          </>
        )}
        {selectedAction?.type === "task-personnel" && (
          <>
            <Button icon="arrow-left" text="Back" minimal small onClick={handleBack} style={{ marginBottom: 12 }} />
            <TaskPersonnelPanel onClose={handlePanelClose} onSubmit={onTaskPersonnelSubmit} />
          </>
        )}
        {selectedAction?.type === "watch" && (
          <>
            <Button icon="arrow-left" text="Back" minimal small onClick={handleBack} style={{ marginBottom: 12 }} />
            <WatchPanel onClose={handlePanelClose} onSubmit={onWatchSubmit} />
          </>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default ActionDialog;
