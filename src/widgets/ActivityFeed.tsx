import { Icon, Classes } from "@blueprintjs/core";

interface FeedEntry {
  id: string;
  user: string;
  initials: string;
  color: string;
  action: string;
  time: string;
}

interface Props {
  items: FeedEntry[];
}

export default function ActivityFeed({ items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <div className="feed-item" key={item.id}>
          <div className="feed-avatar" style={{ background: item.color }}>
            {item.initials}
          </div>
          <div className="feed-content">
            <div className="feed-title">
              <strong>{item.user}</strong> {item.action}
            </div>
            <div className="feed-time">
              <Icon icon="time" size={10} className={Classes.TEXT_MUTED} /> {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
