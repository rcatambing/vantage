import React, { useState, useCallback } from "react";
import { type IComment } from "./Comment.types";
import { Classes, Divider } from "@blueprintjs/core";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

interface CommentThreadProps {
  readonly comments: readonly IComment[];
}

const CommentThread: React.FC<CommentThreadProps> = ({ comments: initialComments }) => {
  const [comments, setComments] = useState<readonly IComment[]>(initialComments);

  const addReplyToComment = (
    list: readonly IComment[],
    parentId: string,
    reply: IComment,
  ): IComment[] =>
    list.map((c) => {
      if (c.id === parentId) {
        return { ...c, replies: [...(c.replies ?? []), reply] };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyToComment(c.replies, parentId, reply) };
      }
      return c;
    });

  const updateLikes = (
    list: readonly IComment[],
    commentId: string,
    delta: 1 | -1,
  ): IComment[] =>
    list.map((c) => {
      if (c.id === commentId) {
        return { ...c, likesCount: Math.max(0, c.likesCount + delta) };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateLikes(c.replies, commentId, delta) };
      }
      return c;
    });

  const handleReply = useCallback((parentId: string, content: string) => {
    const reply: IComment = {
      id: crypto.randomUUID(),
      author: { name: "You", role: "User" },
      timestamp: new Date(),
      content,
      likesCount: 0,
    };
    setComments((prev) => addReplyToComment(prev, parentId, reply));
  }, []);

  const handleLike = useCallback((commentId: string, delta: 1 | -1) => {
    setComments((prev) => updateLikes(prev, commentId, delta));
  }, []);

  const handleNewComment = useCallback((content: string) => {
    const comment: IComment = {
      id: crypto.randomUUID(),
      author: { name: "You", role: "User" },
      timestamp: new Date(),
      content,
      likesCount: 0,
    };
    setComments((prev) => [...prev, comment]);
  }, []);

  const handleEdit = useCallback((commentId: string) => {
    void commentId; // placeholder for edit dialog
  }, []);

  const handleDelete = useCallback((commentId: string) => {
    const removeComment = (list: readonly IComment[]): IComment[] =>
      list
        .filter((c) => c.id !== commentId)
        .map((c) =>
          c.replies ? { ...c, replies: removeComment(c.replies) } : c,
        );
    setComments((prev) => removeComment(prev));
  }, []);

  return (
    <div>
      <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginBottom: 4 }}>
        {comments.length} comment{comments.length !== 1 ? "s" : ""}
      </div>
      <Divider />
      <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 4 }}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <Divider />
      <CommentInput onSubmit={handleNewComment} />
    </div>
  );
};

export default CommentThread;
