import { Icon, Classes } from "@blueprintjs/core";

interface TimelineEntry {
  id: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  time: string;
}

interface Props {
  items: TimelineEntry[];
}

export default function Timeline({ items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <div className="timeline-item" key={item.id}>
          <div className="timeline-dot" style={{ background: item.color }}>
            <Icon icon={item.icon as never} size={12} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
            <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 2 }}>
              {item.description}
            </div>
            <div className={Classes.TEXT_MUTED} style={{ fontSize: 11, marginTop: 4 }}>
              {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
