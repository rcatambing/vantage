
import React from "react";
import { type FeedItem } from "../types";
import { type IComment } from "./Comment.types";
import FeedItemComponent from "./FeedItem";

interface FeedProps {
  readonly items: FeedItem[];
  readonly commentsMap?: Readonly<Record<string, readonly IComment[]>>;
}

const Feed: React.FC<FeedProps> = ({ items, commentsMap }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", height: "100%" }}>
      {items.map((item) => (
        <FeedItemComponent
          key={item.id}
          item={item}
          comments={commentsMap?.[item.id]}
        />
      ))}
    </div>
  );
};

export default Feed;
