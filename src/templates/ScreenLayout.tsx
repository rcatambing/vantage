import { Tag, Button, Intent } from "@blueprintjs/core";
import type { ReactNode } from "react";

interface Props {
  id: string;
  name: string;
  description: string;
  children: ReactNode;
  className?: string;
  onSave?: () => void;
  actions?: ReactNode;
}

export default function ScreenLayout({ id, name, description, children, className, onSave, actions }: Props) {
  return (
    <div className={className}>
      <div className="screen-header">
        <h2>{name}</h2>
        <Tag minimal style={{ fontSize: 12, opacity: 0.6 }}>
          {id}
        </Tag>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {actions}
          {onSave && (
            <Button icon="floppy-disk" intent={Intent.PRIMARY} text="Save Layout" onClick={onSave} small />
          )}
        </div>
        <p className="screen-description">{description}</p>
      </div>
      <div className="vantage-grid">{children}</div>
    </div>
  );
}
