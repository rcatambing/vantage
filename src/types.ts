export type PanelSize = "small" | "medium" | "large" | "wide-small" | "wide-medium" | "wide-large";

export type PanelHeight = "sm" | "md" | "lg" | "fluid";

export interface PanelConfig {
  id: string;          // 7-char alphanumeric
  name: string;        // up to 255 chars
  size: PanelSize;
  component: string;   // registry key
}

export interface ScreenConfig {
  id: string;          // 6-char alphanumeric
  name: string;
  description: string;
  panels: PanelConfig[];
}

export interface GalleryItem {
  code: string;
  name: string;
  description: string;
  group: string;
  icon: string;
  defaultSize: PanelSize;
}

export const PANEL_SIZE_HEIGHT: Record<PanelSize, PanelHeight> = {
  small: "sm",
  medium: "md",
  large: "lg",
  "wide-small": "sm",
  "wide-medium": "md",
  "wide-large": "lg",
};

export type FeedItemStatus = "New" | "For Verification" | "Verified" | "Immediate" | "Critical";

export type FeedActionType = "investigate" | "task-personnel" | "watch";

export interface FeedAction {
  readonly id: string;
  readonly type: FeedActionType;
  readonly label: string;
}

export interface FeedItemMedia {
    type: "image" | "video" | "text";
    src?: string;
    content?: string;
}

export interface FeedItem {
    id: string;
    owner: {
        name: string;
        image: string;
    };
    title: string;
    timestamp: Date;
    location: string;
    status: FeedItemStatus;
    media: FeedItemMedia;
    caption: string;
    actions?: readonly FeedAction[];
}
