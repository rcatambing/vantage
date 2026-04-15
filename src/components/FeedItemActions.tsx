
import React from "react";
import { Button, ButtonGroup } from "@blueprintjs/core";
import ActionButton from "./actions/ActionButton";

interface FeedItemActionsProps {
  readonly onComment?: () => void;
  readonly commentOpen?: boolean;
  readonly onActionClick?: () => void;
  readonly actionActive?: boolean;
  readonly actionDisabled?: boolean;
  readonly onShare?: () => void;
  readonly onRate?: () => void;
  readonly rated?: boolean;
}

const FeedItemActions: React.FC<FeedItemActionsProps> = ({
  onComment,
  commentOpen,
  onActionClick,
  actionActive,
  actionDisabled,
  onShare,
  onRate,
  rated,
}) => {
  return (
    <div style={{ marginTop: 10, borderTop: "1px solid var(--cds-border-subtle)", paddingTop: 8 }}>
      <ButtonGroup fill minimal>
        <Button icon={rated ? "star" : "star-empty"} text="Rate" style={{ flex: 1 }} onClick={onRate} active={rated} small />
        <Button icon="comment" text="Comment" active={commentOpen} onClick={onComment} style={{ flex: 1 }} small />
        <ActionButton
          disabled={actionDisabled}
          isActive={actionActive ?? false}
          onClick={onActionClick}
        />
        <Button icon="share" text="Share" style={{ flex: 1 }} onClick={onShare} small />
      </ButtonGroup>
    </div>
  );
};

export default FeedItemActions;
