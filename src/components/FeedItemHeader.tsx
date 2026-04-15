
import React from "react";
import { type FeedItem, type FeedItemStatus } from "../types";
import { Button, Classes, Icon, Intent, Menu, MenuItem, Popover, Tag } from "@blueprintjs/core";

interface FeedItemHeaderProps {
  item: FeedItem;
}

const STATUS_INTENT: Record<FeedItemStatus, Intent> = {
  New: Intent.PRIMARY,
  "For Verification": Intent.WARNING,
  Verified: Intent.SUCCESS,
  Immediate: Intent.WARNING,
  Critical: Intent.DANGER,
};

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const FeedItemHeader: React.FC<FeedItemHeaderProps> = ({ item }) => {
  const moreMenu = (
    <Menu>
      <MenuItem icon="flag" text="Report" />
      <MenuItem icon="bookmark" text="Save" />
      <MenuItem icon="eye-off" text="Hide" />
    </Menu>
  );

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src={item.owner.image}
          alt={item.owner.name}
          style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <strong style={{ fontSize: 13 }}>{item.owner.name}</strong>
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>{item.title}</div>
          <div className={Classes.TEXT_DISABLED} style={{ fontSize: 10 }}>{getRelativeTime(item.timestamp)}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
        <Popover content={moreMenu} placement="bottom-end">
          <Button icon="more" minimal small />
        </Popover>
        <span className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
          <Icon icon="map-marker" size={11} /> {item.location}
        </span>
        <Tag intent={STATUS_INTENT[item.status]} minimal style={{ fontSize: 11 }}>
          {item.status}
        </Tag>
      </div>
    </div>
  );
};

export default FeedItemHeader;
