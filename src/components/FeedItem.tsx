
import React, { useState } from "react";
import { type FeedItem as FeedItemType } from "../types";
import { type IComment } from "./Comment.types";
import { Card, Elevation, Intent } from "@blueprintjs/core";
import { type InvestigateFormState, type TaskPersonnelFormState, type WatchFormState } from "./actions/ActionTypes";
import { appToaster } from "../toaster";
import FeedItemHeader from "./FeedItemHeader";
import FeedItemContent from "./FeedItemContent";
import FeedItemActions from "./FeedItemActions";
import CommentThread from "./CommentThread";
import ActionDialog from "./actions/ActionDialog";
import ShareDialog from "./actions/ShareDialog";
import RateDialog from "./actions/RateDialog";

interface FeedItemProps {
  readonly item: FeedItemType;
  readonly comments?: readonly IComment[];
}

const FeedItem: React.FC<FeedItemProps> = React.memo(({ item, comments = [] }) => {
  const [showComments, setShowComments] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleInvestigateSubmit = async (state: InvestigateFormState) => {
    setActionDialogOpen(false);
    (await appToaster).show({
      message: `Investigation created \u2014 assigned to ${state.assign.length > 0 ? state.assign.join(", ") : "(unassigned)"}`,
      intent: Intent.SUCCESS,
      icon: "search",
    });
  };

  const handleTaskPersonnelSubmit = async (state: TaskPersonnelFormState) => {
    setActionDialogOpen(false);
    (await appToaster).show({
      message: `Personnel task assigned to ${state.assign.length > 0 ? state.assign.join(", ") : "(unassigned)"} \u2014 priority: ${state.priority}`,
      intent: Intent.SUCCESS,
      icon: "person",
    });
  };

  const handleWatchSubmit = async (state: WatchFormState) => {
    setActionDialogOpen(false);
    (await appToaster).show({
      message: `Now watching this post${state.shareWith.length > 0 ? " \u2014 shared with " + state.shareWith.join(", ") : ""}`,
      intent: Intent.SUCCESS,
      icon: "eye-open",
    });
  };

  const handleShareSubmit = async (recipients: readonly string[]) => {
    (await appToaster).show({
      message: `Post shared with ${recipients.join(", ")}`,
      intent: Intent.SUCCESS,
      icon: "share",
    });
  };

  const handleRateSubmit = async (stars: number) => {
    setRating(stars);
    (await appToaster).show({
      message: `Rated ${stars} ${stars === 1 ? "star" : "stars"}`,
      intent: Intent.SUCCESS,
      icon: "star",
    });
  };

  return (
    <Card elevation={Elevation.ZERO} style={{ padding: 12, border: "1px solid var(--cds-border-subtle)", borderRadius: 0, background: "var(--cds-layer-01)" }}>
      <FeedItemHeader item={item} />
      <FeedItemContent media={item.media} caption={item.caption} />
      <FeedItemActions
        onComment={() => setShowComments((v) => !v)}
        commentOpen={showComments}
        onActionClick={() => setActionDialogOpen(true)}
        actionActive={actionDialogOpen}
        actionDisabled={!item.actions || item.actions.length === 0}
        onShare={() => setShareOpen(true)}
        onRate={() => setRateOpen(true)}
        rated={rating > 0}
      />
      {showComments && <CommentThread comments={comments} />}
      <ActionDialog
        isOpen={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        actions={item.actions ?? []}
        onInvestigateSubmit={handleInvestigateSubmit}
        onTaskPersonnelSubmit={handleTaskPersonnelSubmit}
        onWatchSubmit={handleWatchSubmit}
      />
      <ShareDialog
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onSubmit={handleShareSubmit}
      />
      <RateDialog
        isOpen={rateOpen}
        onClose={() => setRateOpen(false)}
        onSubmit={handleRateSubmit}
        currentRating={rating}
      />
    </Card>
  );
});

export default FeedItem;
