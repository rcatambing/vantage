import React, { useState } from "react";
import { Button, ControlGroup, TextArea } from "@blueprintjs/core";

interface CommentInputProps {
  readonly onSubmit: (content: string) => void;
  readonly placeholder?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit, placeholder = "Write a comment..." }) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <ControlGroup fill style={{ marginTop: 8 }}>
      <TextArea
        fill
        growVertically
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ minHeight: 36, resize: "vertical" }}
      />
      <Button
        icon="send-message"
        intent="primary"
        text="Post"
        disabled={value.trim().length === 0}
        onClick={handleSubmit}
        style={{ alignSelf: "flex-end" }}
      />
    </ControlGroup>
  );
};

export default CommentInput;
