import React, { useState } from "react";
import { Button, FormGroup, Switch, TagInput } from "@blueprintjs/core";
import { type WatchFormState } from "./ActionTypes";

interface WatchPanelProps {
  readonly onClose: () => void;
  readonly onSubmit?: (state: WatchFormState) => void;
}

const WatchPanel: React.FC<WatchPanelProps> = ({ onClose, onSubmit }) => {
  const [featureAtTop, setFeatureAtTop] = useState(false);
  const [shareWith, setShareWith] = useState<readonly string[]>([]);

  const toStrings = (vals: React.ReactNode[]): readonly string[] =>
    vals.filter((v): v is string => typeof v === "string");

  const handleSubmit = () => {
    onSubmit?.({ featureAtTop, shareWith });
    onClose();
  };

  return (
    <>

      <FormGroup label="Watch Priority">
        <Switch
          checked={featureAtTop}
          onChange={(e) => setFeatureAtTop(e.currentTarget.checked)}
          label="Feature updates at the top of your feed"
        />
      </FormGroup>

      <FormGroup
        label="Share With"
        helperText="Notify others to watch this post"
      >
        <TagInput
          values={shareWith}
          onChange={(vals) => setShareWith(toStrings(vals))}
          placeholder="Type a name or group and press Enter…"
          fill
        />
      </FormGroup>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
        <Button text="Cancel" onClick={onClose} />
        <Button text="Watch Post" intent="primary" icon="eye-open" onClick={handleSubmit} />
      </div>
    </>
  );
};

export default WatchPanel;
