import React from "react";
import { Button } from "@blueprintjs/core";

interface ActionButtonProps {
  readonly disabled?: boolean;
  readonly isActive: boolean;
  readonly onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ disabled, isActive, onClick }) => {
  if (disabled) {
    return <Button icon="lightning" text="Action" disabled style={{ flex: 1 }} />;
  }

  return (
    <Button
      icon="lightning"
      text="Action"
      active={isActive}
      onClick={onClick}
      style={{ flex: 1 }}
    />
  );
};

export default ActionButton;
