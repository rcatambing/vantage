import React, { useState } from "react";
import { Button, Classes, Dialog, DialogBody, DialogFooter, Icon } from "@blueprintjs/core";
import { useApp } from "../../context/useApp";

interface RateDialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (rating: number) => void;
  readonly currentRating: number;
}

const MAX_STARS = 5;

const RateDialog: React.FC<RateDialogProps> = ({ isOpen, onClose, onSubmit, currentRating }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(currentRating);
  const { darkMode } = useApp();

  const handleOpen = () => {
    setSelected(currentRating);
    setHovered(0);
  };

  const handleSubmit = () => {
    onSubmit(selected);
    onClose();
  };

  const handleClose = () => {
    setSelected(currentRating);
    onClose();
  };

  const displayValue = hovered || selected;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} onOpened={handleOpen} title="Rate This Post" icon="star" className={darkMode ? Classes.DARK : undefined}>
      <DialogBody>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "12px 0" }}>
          {Array.from({ length: MAX_STARS }, (_, i) => i + 1).map((star) => (
            <span
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              style={{ cursor: "pointer", fontSize: 32, lineHeight: 1 }}
            >
              <Icon
                icon={star <= displayValue ? "star" : "star-empty"}
                size={32}
                color={star <= displayValue ? "#FFC940" : undefined}
              />
            </span>
          ))}
        </div>
        {displayValue > 0 && (
          <p style={{ textAlign: "center", margin: 0 }}>
            {displayValue} {displayValue === 1 ? "star" : "stars"}
          </p>
        )}
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button text="Cancel" onClick={handleClose} />
            <Button
              text="Submit Rating"
              intent="primary"
              icon="star"
              onClick={handleSubmit}
              disabled={selected === 0}
            />
          </>
        }
      />
    </Dialog>
  );
};

export default RateDialog;
