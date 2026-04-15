import { Card, Elevation, Tag, Button, Popover, Menu, MenuItem } from "@blueprintjs/core";
import type { PanelSize } from "../types";
import { PANEL_SIZE_HEIGHT } from "../types";
import type { ReactNode } from "react";

interface Props {
  id: string;
  name: string;
  size: PanelSize;
  children: ReactNode;
  onRemove?: () => void;
}

export default function Panel({ id, name, size, children, onRemove }: Props) {
  const height = PANEL_SIZE_HEIGHT[size];

  const actionMenu = (
    <Menu>
      <MenuItem icon="cog" text="Settings" />
      <MenuItem icon="maximize" text="Expand" />
      <MenuItem icon="cross" text="Remove" intent="danger" onClick={onRemove} />
    </Menu>
  );

  return (
    <Card
      elevation={Elevation.ZERO}
      className={`vantage-panel panel-${size} panel-height-${height}`}
      style={{ padding: 0 }}
    >
      <div className="panel-header">
        <span className="panel-title">{name}</span>
        <Tag minimal style={{ fontSize: 11 }}>
          {id}
        </Tag>
        <Popover content={actionMenu} placement="bottom-end">
          <Button icon="more" minimal small />
        </Popover>
      </div>
      <div className="panel-body">{children}</div>
    </Card>
  );
}
