import React, { useState, useCallback } from "react";
import { type IComment } from "./Comment.types";
import {
  Button,
  ButtonGroup,
  Classes,
  H6,
  Icon,
  Intent,
  Menu,
  MenuItem,
  Popover,
  Tag,
  Text,
} from "@blueprintjs/core";
import CommentInput from "./CommentInput";

interface CommentItemProps {
  readonly comment: IComment;
  readonly depth?: number;
  readonly onReply?: (parentId: string, content: string) => void;
  readonly onLike?: (commentId: string, delta: 1 | -1) => void;
  readonly onEdit?: (commentId: string) => void;
  readonly onDelete?: (commentId: string) => void;
}

const MAX_DEPTH = 1;

const getRelativeTime = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const CommentItem: React.FC<CommentItemProps> = React.memo(({
  comment,
  depth = 0,
  onReply,
  onLike,
  onEdit,
  onDelete,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(comment.likesCount);

  const handleLike = useCallback(
    (delta: 1 | -1) => {
      setOptimisticLikes((prev) => Math.max(0, prev + delta));
      onLike?.(comment.id, delta);
    },
    [comment.id, onLike],
  );

  const handleReplySubmit = useCallback(
    (content: string) => {
      onReply?.(comment.id, content);
      setShowReplyInput(false);
    },
    [comment.id, onReply],
  );

  const actionsMenu = (
    <Menu>
      <MenuItem icon="edit" text="Edit" onClick={() => onEdit?.(comment.id)} />
      <MenuItem icon="trash" text="Delete" intent={Intent.DANGER} onClick={() => onDelete?.(comment.id)} />
    </Menu>
  );

  return (
    <div style={{ marginLeft: depth > 0 ? 32 : 0, marginTop: 8 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Avatar */}
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <Icon icon="user" size={32} intent={Intent.PRIMARY} style={{ flexShrink: 0 }} />
        )}

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Author line */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <H6 style={{ margin: 0 }}>{comment.author.name}</H6>
            <Tag minimal>
              {comment.author.role}
            </Tag>
            <span className={Classes.TEXT_DISABLED} style={{ fontSize: 11, marginLeft: "auto", whiteSpace: "nowrap" }}>
              {getRelativeTime(comment.timestamp)}
            </span>
          </div>

          {/* Content */}
          <Text style={{ marginTop: 4 }}>{comment.content}</Text>

          {/* Actions bar */}
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <ButtonGroup minimal>
              <Button icon="thumbs-up" small onClick={() => handleLike(1)} />
              <Button icon="thumbs-down" small onClick={() => handleLike(-1)} />
            </ButtonGroup>
            <span className={Classes.TEXT_MUTED} style={{ fontSize: 12, minWidth: 20 }}>
              {optimisticLikes}
            </span>
            {depth < MAX_DEPTH && (
              <Button
                icon="chat"
                text="Reply"
                minimal
                small
                onClick={() => setShowReplyInput((v) => !v)}
              />
            )}
            <Popover content={actionsMenu} placement="bottom-end">
              <Button icon="more" minimal small />
            </Popover>
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <CommentInput onSubmit={handleReplySubmit} placeholder="Write a reply..." />
          )}

          {/* Nested replies */}
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default CommentItem;
