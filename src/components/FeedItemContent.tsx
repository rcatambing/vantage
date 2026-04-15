
import React from "react";
import { type FeedItemMedia } from "../types";
import { Classes } from "@blueprintjs/core";

interface FeedItemContentProps {
  media: FeedItemMedia;
  caption: string;
}

const FeedItemContent: React.FC<FeedItemContentProps> = ({
  media,
  caption,
}) => {
  const renderMedia = () => {
    switch (media.type) {
      case "image":
        return (
          <img
            src={media.src}
            alt="Feed content"
            style={{ width: "100%", borderRadius: 0 }}
          />
        );
      case "video":
        return (
          <video src={media.src} controls style={{ width: "100%", borderRadius: 0 }} />
        );
      case "text":
        return <p className={Classes.RUNNING_TEXT}>{media.content}</p>;
      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      {renderMedia()}
      <p style={{ marginTop: 8 }}>{caption}</p>
    </div>
  );
};

export default FeedItemContent;
